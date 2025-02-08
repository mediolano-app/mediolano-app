#[starknet::contract]
mod MarketplaceContract {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess, StoragePointerWriteAccess};
    use core::array::ArrayTrait;

    #[storage]
    struct Storage {
        owner: ContractAddress,
        users: Map::<ContractAddress, User>,
        assets: Map::<u256, Asset>,
        asset_count: u256,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserRegistered: UserRegistered,
        AssetListed: AssetListed,
        AssetSold: AssetSold,
    }

    #[derive(Drop, starknet::Event)]
    struct UserRegistered {
        address: ContractAddress,
        username: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct AssetListed {
        asset_id: u256,
        owner: ContractAddress,
        price: u256,
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
    fn register_user(
        ref self: ContractState,
        username: felt252,
        bio: felt252,
        social_link: felt252
    ) {
        let caller = get_caller_address();
        assert!(!self.users.read(caller).registered, "User already registered");

        let new_user = User {
            username: username,
            bio: bio,
            social_link: social_link,
            registered: true,
        };
        self.users.write(caller, new_user);

        self.emit(UserRegistered { address: caller, username: username });
    }

    #[external(v0)]
    fn update_user_profile(
        ref self: ContractState,
        bio: felt252,
        social_link: felt252
    ) {
        let caller = get_caller_address();
        let mut user = self.users.read(caller);
        assert!(user.registered, "User not registered");

        user.bio = bio;
        user.social_link = social_link;
        self.users.write(caller, user);
    }

    #[external(v0)]
    fn list_asset(ref self: ContractState, price: u256) {
        let caller = get_caller_address();
        let user = self.users.read(caller);
        assert!(user.registered, "User not registered");

        let asset_id = self.asset_count.read() + 1;
        let new_asset = Asset {
            owner: caller,
            price: price,
        };
        self.assets.write(asset_id, new_asset);
        self.asset_count.write(asset_id);

        self.emit(AssetListed { asset_id: asset_id, owner: caller, price: price });
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
        let updated_asset = Asset { owner: caller, ..asset };
        self.assets.write(asset_id, updated_asset);

        self.emit(AssetSold {
            asset_id: asset_id,
            seller: asset.owner,
            buyer: caller,
            price: asset.price
        });
    }

    #[external(v0)]
    fn get_user_profile(self: @ContractState, address: ContractAddress) -> User {
        self.users.read(address)
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
