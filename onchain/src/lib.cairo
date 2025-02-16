#[starknet::contract]
mod MarketplaceContract {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};

    #[storage]
    struct Storage {
        owner: ContractAddress,
        users: Map::<ContractAddress, User>,
        assets: Map::<u256, Asset>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserRegistered: UserRegistered,
        AssetCreated: AssetCreated,
        AssetUpdated: AssetUpdated,
        AssetSold: AssetSold,
    }

    #[derive(Drop, starknet::Event)]
    struct UserRegistered {
        address: ContractAddress,
        username: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct AssetCreated {
        asset_id: u256,
        owner: ContractAddress,
        price: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct AssetUpdated {
        asset_id: u256,
        new_price: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct AssetSold {
        asset_id: u256,
        seller: ContractAddress,
        buyer: ContractAddress,
        price: u256,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct User {
        username: felt252,
        bio: felt252,
        social_link: felt252,
        registered: bool,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct Asset {
        owner: ContractAddress,
        price: u256,
    }

    // ... (constructor and other functions remain the same)

    #[external(v0)]
    fn create_asset(ref self: ContractState, asset_id: u256, price: u256) {
        let caller = get_caller_address();
        let user = self.users.read(caller);
        assert!(user.registered, "User not registered");

        let new_asset = Asset { owner: caller, price: price };
        self.assets.write(asset_id, new_asset);

        self.emit(AssetCreated { asset_id: asset_id, owner: caller, price: price });
    }

    #[external(v0)]
    fn update_asset_price(ref self: ContractState, asset_id: u256, new_price: u256) {
        let caller = get_caller_address();
        let mut asset = self.assets.read(asset_id);
        assert!(asset.owner == caller, "Only owner can update price");

        asset.price = new_price;
        self.assets.write(asset_id, asset);

        self.emit(AssetUpdated { asset_id: asset_id, new_price: new_price });
    }

    #[external(v0)]
    fn buy_asset(ref self: ContractState, asset_id: u256) {
        let caller = get_caller_address();
        let buyer = self.users.read(caller);
        assert!(buyer.registered, "Buyer not registered");

        let asset = self.assets.read(asset_id);
        assert!(asset.owner != caller, "Cannot buy your own asset");

        // In a real implementation, you'd handle the payment here

        // Update asset ownership
        let updated_asset = Asset { owner: caller, price: asset.price };
        self.assets.write(asset_id, updated_asset);

        self.emit(AssetSold { 
            asset_id: asset_id, 
            seller: asset.owner, 
            buyer: caller, 
            price: asset.price 
        });
    }

    #[external(v0)]
    fn get_asset_details(self: @ContractState, asset_id: u256) -> Option<Asset> {
        let asset = self.assets.read(asset_id);
        if asset.owner == starknet::contract_address_const::<0>() {
            Option::None
        } else {
            Option::Some(asset)
        }
    }
}
