use starknet::{ContractAddress, get_caller_address};
use core::traits::Into;
use core::array::SpanTrait;

#[starknet::interface]
trait IMediolanoMarketplace<TState> {
    fn purchase_multiple_assets(
        ref self: TState, assets: Array<DigitalAsset>, payment_currency: ContractAddress
    );
    fn set_commission_rate(ref self: TState, rate: u256);
    fn add_supported_currency(ref self: TState, currency: ContractAddress);
    fn remove_supported_currency(ref self: TState, currency: ContractAddress);
    fn register_digital_asset(
        ref self: TState,
        asset_id: u256,
        seller: ContractAddress,
        price: u256,
        metadata_hash: felt252
    );
    fn get_asset_metadata(self: @TState, asset_id: u256) -> felt252;
    fn get_commission_rate(self: @TState) -> u256;
    fn is_currency_supported(self: @TState, currency: ContractAddress) -> bool;
}

#[starknet::contract]
mod MediolanoMarketplace {
    use super::IMediolanoMarketplace;
    use starknet::{ContractAddress, get_caller_address};
    use core::traits::Into;
    use core::array::SpanTrait;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::security::pausable::PausableComponent;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: PausableComponent, storage: pausable, event: PausableEvent);

    #[derive(Drop, Serde, starknet::Store)]
    struct DigitalAsset {
        seller: ContractAddress,
        asset_id: u256,
        price: u256,
        metadata_ipfs_hash: felt252
    }

    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        pausable: PausableComponent::Storage,
        commission_rate: u256,
        supported_currencies: LegacyMap::<ContractAddress, bool>,
        asset_metadata: LegacyMap::<u256, felt252>,
        asset_ownership: LegacyMap::<u256, ContractAddress>,
        asset_registered: LegacyMap::<u256, bool>
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AssetPurchased: AssetPurchased,
        AssetRegistered: AssetRegistered,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        PausableEvent: PausableComponent::Event
    }

    #[derive(Drop, starknet::Event)]
    struct AssetPurchased {
        asset_id: u256,
        buyer: ContractAddress,
        seller: ContractAddress,
        price: u256
    }

    #[derive(Drop, starknet::Event)]
    struct AssetRegistered {
        asset_id: u256,
        seller: ContractAddress,
        price: u256
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_owner: ContractAddress) {
        self.ownable.initializer(initial_owner);
        self.commission_rate.write(500); // 5% default commission
    }

    #[abi(embed_v0)]
    impl MediolanoMarketplaceImpl of super::IMediolanoMarketplace<ContractState> {
        fn purchase_multiple_assets(
            ref self: ContractState, assets: Array<DigitalAsset>, payment_currency: ContractAddress
        ) {
            self.pausable.assert_not_paused();
            assert!(self.supported_currencies.read(payment_currency), "Invalid payment currency");

            let buyer = get_caller_address();
            let total_price = self._calculate_total_price(@assets);

            self._process_payments(assets.span(), total_price, payment_currency, buyer);
            self._transfer_asset_ownership(assets.span(), buyer);
        }

        fn register_digital_asset(
            ref self: ContractState,
            asset_id: u256,
            seller: ContractAddress,
            price: u256,
            metadata_hash: felt252
        ) {
            self.ownable.assert_only_owner();
            assert!(!self.asset_registered.read(asset_id), "Asset already registered");

            self.asset_metadata.write(asset_id, metadata_hash);
            self.asset_ownership.write(asset_id, seller);
            self.asset_registered.write(asset_id, true);

            self.emit(AssetRegistered { asset_id, seller, price });
        }

        fn set_commission_rate(ref self: ContractState, rate: u256) {
            self.ownable.assert_only_owner();
            assert!(rate < 10000, "Invalid commission rate");
            self.commission_rate.write(rate);
        }

        fn add_supported_currency(ref self: ContractState, currency: ContractAddress) {
            self.ownable.assert_only_owner();
            self.supported_currencies.write(currency, true);
        }

        fn remove_supported_currency(ref self: ContractState, currency: ContractAddress) {
            self.ownable.assert_only_owner();
            self.supported_currencies.write(currency, false);
        }

        fn get_asset_metadata(self: @ContractState, asset_id: u256) -> felt252 {
            self.asset_metadata.read(asset_id)
        }

        fn get_commission_rate(self: @ContractState) -> u256 {
            self.commission_rate.read()
        }

        fn is_currency_supported(self: @ContractState, currency: ContractAddress) -> bool {
            self.supported_currencies.read(currency)
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _calculate_total_price(self: @ContractState, assets: @Array<DigitalAsset>) -> u256 {
            let mut total: u256 = 0;
            let mut i: usize = 0;

            loop {
                if i >= assets.len() {
                    break total;
                }
                let asset = assets[i];
                assert!(self.asset_registered.read(asset.asset_id), "Unregistered asset");
                total += asset.price;
                i = i + 1;
            }
        }

        fn _process_payments(
            ref self: ContractState,
            assets: Span<DigitalAsset>,
            total_price: u256,
            currency: ContractAddress,
            buyer: ContractAddress
        ) {
            let commission_rate = self.commission_rate.read();
            let commission = (total_price * commission_rate) / 10000;
            let owner = self.ownable.owner();
            let currency_contract = IERC20Dispatcher { contract_address: currency };

            // Transfer commission to owner
            currency_contract.transfer_from(buyer, owner, commission);

            // Distribute remaining funds to sellers
            let mut i: usize = 0;
            loop {
                if i >= assets.len() {
                    break ();
                }
                let asset = *assets[i];
                currency_contract.transfer_from(buyer, asset.seller, asset.price);

                self
                    .emit(
                        AssetPurchased {
                            asset_id: asset.asset_id,
                            buyer,
                            seller: asset.seller,
                            price: asset.price
                        }
                    );
                i = i + 1;
            }
        }

        fn _transfer_asset_ownership(
            ref self: ContractState, assets: Span<DigitalAsset>, buyer: ContractAddress
        ) {
            let mut i: usize = 0;
            loop {
                if i >= assets.len() {
                    break ();
                }
                let asset = *assets[i];
                let current_owner = self.asset_ownership.read(asset.asset_id);
                assert!(current_owner == asset.seller, "Invalid asset ownership");

                self.asset_ownership.write(asset.asset_id, buyer);
                i = i + 1;
            }
        }
    }
}
