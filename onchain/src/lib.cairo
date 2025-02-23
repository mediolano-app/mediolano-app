#[starknet::contract]
mod MarketplaceViewerContract {
    use starknet::{ContractAddress, contract_address_const};
    use starknet::get_caller_address;
    use starknet::syscalls::call_contract_syscall;
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess, StoragePointerWriteAccess};
    use core::array::ArrayTrait;

    #[storage]
    struct Storage {
        owner: ContractAddress,
        asset_contract_addresses: Map::<felt252, ContractAddress>,
    }

    #[derive(Drop, Serde)]
    struct AssetDetails {
        owner: felt252,
        price: felt252,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AssetContractAdded: AssetContractAdded,
    }

    #[derive(Drop, starknet::Event)]
    struct AssetContractAdded {
        asset_type: felt252,
        contract_address: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.owner.write(owner);
    }

    #[external(v0)]
    fn add_asset_contract(ref self: ContractState, asset_type: felt252, contract_address: ContractAddress) {
        assert(get_caller_address() == self.owner.read(), 'Only owner can add');
        self.asset_contract_addresses.write(asset_type, contract_address);
        self.emit(AssetContractAdded { asset_type, contract_address });
    }

    #[external(v0)]
    fn get_asset_details(self: @ContractState, asset_type: felt252, asset_id: u256) -> AssetDetails {
        let contract_address = self.asset_contract_addresses.read(asset_type);
        assert(contract_address != get_caller_address(), 'contract not registered');

        // Call the external contract to get asset details
        let result = call_contract_syscall(
            contract_address,
            selector!("get_asset_details"),
            array![asset_id.try_into().unwrap()].span()
        ).unwrap();

        // Parse the result into AssetDetails
        assert(result.len() == 2, 'Unexpected result length');

        let owner_address = *result[0];
        let price = *result[1];
    
        // Create the AssetDetails struct.
        AssetDetails {
            owner: owner_address.try_into().unwrap(),
            price: price.try_into().unwrap(),
        }
    }

    #[external(v0)]
    fn get_user_assets(self: @ContractState, asset_type: felt252, user: ContractAddress) -> Array<u256> {
        let contract_address = self.asset_contract_addresses.read(asset_type);
        assert(contract_address != get_caller_address(), 'contract not registered');

        // Call the external contract to get user assets
        let result = call_contract_syscall(
            contract_address,
            selector!("get_user_assets"),
            array![user.into()].span()
        ).unwrap();

        // Ensure we received an even number of elements (each u256 is two felts).
        let len = result.len();
        assert(len % 2 == 0, 'Unexpected result length');
    
        // Calculate the number of asset IDs.
        let num_assets = len / 2;
    
        // Initialize an empty array to hold the asset IDs.
        let mut assets: Array<u256> = ArrayTrait::new();

        let mut i = 0;
        while i < num_assets {
            let low: felt252 = *result[2 * i];
            let high: felt252 = *result[2 * i + 1];
            assets.append(u256 { low: low.try_into().unwrap(), high: high.try_into().unwrap() });
            i = i + 1;
        };
        assets

    }
}
