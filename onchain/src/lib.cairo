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
        transactions: Map::<u256, Transaction>,
        asset_count: u256,
        tx_count: u256,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserRegistered: UserRegistered,
        AssetListed: AssetListed,
        AssetSold: AssetSold,
        AssetTransferred: AssetTransferred,
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

    #[derive(Drop, starknet::Event)]
    struct AssetTransferred {
        asset_id: u256,
        from: ContractAddress,
        to: ContractAddress,
    }


    #[derive(Drop, Serde, starknet::Store)]
    struct User {
        address: ContractAddress,
        username: felt252,
        registered: bool,
        listed_assets: u32,
        owned_assets: u32,
        transactions: u32,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct Asset {
        id: u256,
        owner: ContractAddress,
        price: u256,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct Transaction {
        id: u256,
        seller: ContractAddress,
        buyer: ContractAddress,
        asset_id: u256,
        price: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        let caller = get_caller_address();
        self.owner.write(caller);
        self.asset_count.write(0);
        self.tx_count.write(0);
    }

    #[external(v0)]
    fn register_user(ref self: ContractState, username: felt252) {
        let caller = get_caller_address();
        assert!(!self.users.read(caller).registered, "User already registered");

        let new_user = User {
            address: caller,
            username: username,
            registered: true,
            listed_assets: 0,
            owned_assets: 0,
            transactions: 0,
        };

        self.users.write(caller, new_user);
        self.emit(UserRegistered { address: caller, username: username });
    }

    #[external(v0)]
    fn get_user_assets(self: @ContractState, address: ContractAddress) -> u32 {
        self.users.read(address).owned_assets
    }

    #[external(v0)]
    fn list_asset(ref self: ContractState, price: u256) {
        let caller = get_caller_address();
        let user = self.users.read(caller);
        assert!(user.registered, "User not registered");

        let asset_id = self.asset_count.read() + 1;
        let new_asset = Asset {
            id: asset_id,
            owner: caller,
            price: price,
        };

        self.assets.write(asset_id, new_asset);
        self.asset_count.write(asset_id);

        // Update user's listed assets count
        let updated_user = User {
            listed_assets: user.listed_assets + 1,
            ..user
        };
        self.users.write(caller, updated_user);

        self.emit(AssetListed { asset_id: asset_id, owner: caller, price: price });
    }

    #[external(v0)]
    fn buy_asset(ref self: ContractState, asset_id: u256) {
        let caller = get_caller_address();
        let buyer = self.users.read(caller);
        assert!(buyer.registered, "Buyer not registered");

        let asset = self.assets.read(asset_id);
        assert!(asset.owner != caller, "Cannot buy your own asset");

        let seller = self.users.read(asset.owner);

        // In a real implementation, you'd handle the payment here

        // Update asset ownership
        let updated_asset = Asset {
            owner: caller,
            ..asset
        };
        self.assets.write(asset_id, updated_asset);

        // Update buyer and seller info
        let updated_buyer = User {
            owned_assets: buyer.owned_assets + 1,
            transactions: buyer.transactions + 1,
            ..buyer
        };
        self.users.write(caller, updated_buyer);

        let updated_seller = User {
            listed_assets: seller.listed_assets - 1,
            transactions: seller.transactions + 1,
            ..seller
        };
        self.users.write(asset.owner, updated_seller);

        // Record transaction
        let tx_id = self.tx_count.read() + 1;
        let new_transaction = Transaction {
            id: tx_id,
            seller: asset.owner,
            buyer: caller,
            asset_id: asset_id,
            price: asset.price,
        };
        self.transactions.write(tx_id, new_transaction);
        self.tx_count.write(tx_id);

        self.emit(AssetSold { 
            asset_id: asset_id, 
            seller: asset.owner, 
            buyer: caller, 
            price: asset.price 
        });
    }

    #[external(v0)]
    fn get_transaction_history(self: @ContractState, user: ContractAddress) -> Array<Transaction> {
        let mut history = ArrayTrait::new();
        let tx_count = self.tx_count.read();
        let mut i: u256 = 1;

        loop {
            if i > tx_count {
                break;
            }
            let tx = self.transactions.read(i);
            if tx.seller == user || tx.buyer == user {
                history.append(tx);
            }
            i += 1;
        };

        history
    }

    #[external(v0)]
    fn get_asset_details(self: @ContractState, asset_id: u256) -> Option<Asset> {
        let asset = self.assets.read(asset_id);
        if asset.id == 0 {
            Option::None
        } else {
            Option::Some(asset)
        }
    }

    #[external(v0)]
    fn get_recent_transactions(self: @ContractState, limit: u32) -> Array<Transaction> {
        let mut recent_txs = ArrayTrait::new();
        let tx_count = self.tx_count.read();
        let mut i = tx_count;
        let mut count: u32 = 0;

        loop {
            if i == 0 || count == limit {
                break;
            }
            let tx = self.transactions.read(i);
            recent_txs.append(tx);
            i -= 1;
            count += 1;
        };

        recent_txs
    }
}
