use starknet::ContractAddress;

#[starknet::interface]
pub trait IIPIdentity<TContractState> {
    fn register_ip_id(
        ref self: TContractState,
        ip_id: felt252,
        metadata_uri: ByteArray,
        ip_type: ByteArray,
        license_terms: ByteArray,
    ) -> u256;

    fn update_ip_id_metadata(
        ref self: TContractState, ip_id: felt252, new_metadata_uri: ByteArray,
    );

    fn get_ip_id_data(self: @TContractState, ip_id: felt252) -> IPIDData;

    fn get_ip_id_by_owner(self: @TContractState, owner: ContractAddress) -> felt252;

    fn get_owner_by_ip_id(self: @TContractState, ip_id: felt252) -> ContractAddress;

    fn verify_ip_id(ref self: TContractState, ip_id: felt252);

    fn set_payment_token(ref self: TContractState, token_address: ContractAddress);

    fn set_paused(ref self: TContractState, paused: bool);
}

#[derive(Drop, Serde, starknet::Store, Clone)]
pub struct IPIDData {
    pub metadata_uri: ByteArray,
    pub ip_type: ByteArray,
    pub license_terms: ByteArray,
    pub is_verified: bool,
    pub created_at: u64,
    pub updated_at: u64,
}

#[starknet::contract]
pub mod IPIdentity {
    use core::{
        array::ArrayTrait, traits::{Into,}, num::traits::Zero,
        starknet::{
            ContractAddress,
            storage::{
                StoragePointerWriteAccess, StoragePointerReadAccess, StorageMapReadAccess,
                StorageMapWriteAccess, Map
            },
            get_caller_address, get_contract_address, get_block_timestamp
        },
    };
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::security::pausable::PausableComponent;
    use openzeppelin::token::erc721::ERC721Component;
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use super::{IIPIdentity, IPIDData};

    // Components
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: PausableComponent, storage: pausable, event: PausableEvent);
    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // Impls
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    #[abi(embed_v0)]
    impl PausableImpl = PausableComponent::PausableImpl<ContractState>;
    impl PausableInternalImpl = PausableComponent::InternalImpl<ContractState>;
    #[abi(embed_v0)]
    impl ERC721Impl = ERC721Component::ERC721Impl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;
    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

    // Implement ERC721HooksTrait
    impl ERC721HooksImpl of ERC721Component::ERC721HooksTrait<ContractState> {
        fn before_update(
            ref self: ERC721Component::ComponentState<ContractState>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress
        ) {}

        fn after_update(
            ref self: ERC721Component::ComponentState<ContractState>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress
        ) {}
    }

    // Constants
    const MINT_PRICE: u256 = 1000000000000000; // 0.001 ETH
    const ERROR_INVALID_PAYMENT: felt252 = 'Invalid payment amount';
    const ERROR_ALREADY_REGISTERED: felt252 = 'IP ID already registered';
    const ERROR_NOT_OWNER: felt252 = 'Caller is not the owner';
    const ERROR_INVALID_IP_ID: felt252 = 'Invalid IP ID';

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        pausable: PausableComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        ip_id_to_owner: Map<felt252, ContractAddress>,
        owner_to_ip_id: Map<ContractAddress, felt252>,
        ip_id_data: Map<felt252, IPIDData>,
        token_counter: u256,
        mint_payment_token: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        PausableEvent: PausableComponent::Event,
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        IPIDRegistered: IPIDRegistered,
        IPIDUpdated: IPIDUpdated,
        PaymentTokenUpdated: PaymentTokenUpdated,
    }

    #[derive(Drop, starknet::Event)]
    struct IPIDRegistered {
        ip_id: felt252,
        owner: ContractAddress,
        token_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct IPIDUpdated {
        ip_id: felt252,
        owner: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct PaymentTokenUpdated {
        new_token: ContractAddress,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        name: ByteArray,
        symbol: ByteArray,
        base_uri: ByteArray,
        payment_token: ContractAddress,
    ) {
        self.ownable.initializer(owner);
        self.erc721.initializer(name, symbol, base_uri);
        self.mint_payment_token.write(payment_token);
    }

    #[abi(embed_v0)]
    impl IPIdentityImpl of IIPIdentity<ContractState> {
        fn register_ip_id(
            ref self: ContractState,
            ip_id: felt252,
            metadata_uri: ByteArray,
            ip_type: ByteArray,
            license_terms: ByteArray,
        ) -> u256 {
            self.pausable.assert_not_paused();

            // Check if IP ID is already registered
            assert(self.ip_id_to_owner.read(ip_id).is_zero(), ERROR_ALREADY_REGISTERED);

            let caller = get_caller_address();

            // Process payment
            self._process_payment(caller, MINT_PRICE);

            // Mint NFT
            let token_id = self.token_counter.read() + 1;
            self.token_counter.write(token_id);
            self.erc721.mint(caller, token_id); // Changed from _mint to mint

            // Store IP ID data
            let ip_data = IPIDData {
                metadata_uri,
                ip_type,
                license_terms,
                is_verified: false,
                created_at: get_block_timestamp(),
                updated_at: get_block_timestamp(),
            };

            self.ip_id_data.write(ip_id, ip_data);
            self.ip_id_to_owner.write(ip_id, caller);
            self.owner_to_ip_id.write(caller, ip_id);

            self.emit(IPIDRegistered { ip_id, owner: caller, token_id });

            token_id
        }

        fn update_ip_id_metadata(
            ref self: ContractState, ip_id: felt252, new_metadata_uri: ByteArray,
        ) {
            self.pausable.assert_not_paused();

            let caller = get_caller_address();
            let owner = self.ip_id_to_owner.read(ip_id);
            assert(owner.is_non_zero(), ERROR_INVALID_IP_ID);
            assert(caller == owner, ERROR_NOT_OWNER);

            // Update data
            let mut ip_data = self.ip_id_data.read(ip_id);
            ip_data.metadata_uri = new_metadata_uri;
            ip_data.updated_at = get_block_timestamp();
            self.ip_id_data.write(ip_id, ip_data);

            self.emit(IPIDUpdated { ip_id, owner: caller });
        }

        fn get_ip_id_data(self: @ContractState, ip_id: felt252) -> IPIDData {
            assert(self.ip_id_to_owner.read(ip_id).is_non_zero(), ERROR_INVALID_IP_ID);
            self.ip_id_data.read(ip_id)
        }

        fn get_ip_id_by_owner(self: @ContractState, owner: ContractAddress) -> felt252 {
            let ip_id = self.owner_to_ip_id.read(owner);
            assert(ip_id != 0, ERROR_INVALID_IP_ID);
            ip_id
        }

        fn get_owner_by_ip_id(self: @ContractState, ip_id: felt252) -> ContractAddress {
            let owner = self.ip_id_to_owner.read(ip_id);
            assert(owner.is_non_zero(), ERROR_INVALID_IP_ID);
            owner
        }

        fn verify_ip_id(ref self: ContractState, ip_id: felt252) {
            self.ownable.assert_only_owner();

            let owner = self.ip_id_to_owner.read(ip_id);
            assert(owner.is_non_zero(), ERROR_INVALID_IP_ID);

            let mut ip_data = self.ip_id_data.read(ip_id);
            ip_data.is_verified = true;
            ip_data.updated_at = get_block_timestamp();
            self.ip_id_data.write(ip_id, ip_data);

            self.emit(IPIDUpdated { ip_id, owner });
        }

        fn set_payment_token(ref self: ContractState, token_address: ContractAddress) {
            self.ownable.assert_only_owner();
            self.mint_payment_token.write(token_address);
            self.emit(PaymentTokenUpdated { new_token: token_address });
        }

        fn set_paused(ref self: ContractState, paused: bool) {
            self.ownable.assert_only_owner();
            if paused {
                self.pausable.pause();
            } else {
                self.pausable.unpause();
            }
        }
    }

    #[generate_trait]
    impl Private of PrivateTrait {
        fn _process_payment(ref self: ContractState, from: ContractAddress, amount: u256) {
            let token = IERC20Dispatcher { contract_address: self.mint_payment_token.read() };
            let success = token.transfer_from(from, get_contract_address(), amount);
            assert(success, ERROR_INVALID_PAYMENT);
        }
    }
}
