#[starknet::contract]
mod VisibilityManagement {
    use starknet::get_caller_address;
    use starknet::ContractAddress;
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};

    #[storage]
    struct Storage {
        visibility: Map<(u256, ContractAddress), u8>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        VisibilityChanged: VisibilityChanged,
    }

    #[derive(Drop, starknet::Event)]
    struct VisibilityChanged {
        asset_id: u256,
        owner: ContractAddress,
        visibility_status: u8,
    }

    #[external(v0)]
    fn set_visibility(ref self: ContractState, asset_id: u256, visibility_status: u8) {
        assert(visibility_status == 0 || visibility_status == 1, 'Invalid visibility status');
        
        let caller = get_caller_address();
        self.visibility.write((asset_id, caller), visibility_status);
        
        self.emit(Event::VisibilityChanged(VisibilityChanged {
            asset_id: asset_id,
            owner: caller,
            visibility_status: visibility_status
        }));
    }

    #[external(v0)]
    fn get_visibility(self: @ContractState, asset_id: u256, owner: ContractAddress) -> u8 {
        self.visibility.read((asset_id, owner))
    }
}