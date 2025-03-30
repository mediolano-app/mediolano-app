// Add to src/interfaces.cairo
use starknet::ContractAddress;

#[starknet::interface]
pub trait IIPID<TContractState> {
    // Registration and profile management
    fn register_ip_id(
        ref self: TContractState,
        name: ByteArray,
        description: ByteArray,
        metadata_uri: ByteArray,
        metadata_hash: ByteArray,
    ) -> u256;

    fn update_profile(
        ref self: TContractState,
        id: u256,
        description: ByteArray,
        metadata_uri: ByteArray,
        metadata_hash: ByteArray,
    );

    fn get_profile(self: @TContractState, id: u256) -> IPProfile;
    fn get_id_by_owner(self: @TContractState, owner: ContractAddress) -> u256;
    fn get_id_by_name(self: @TContractState, name: ByteArray) -> u256;

    // IP Asset linking
    // fn link_ip_asset(ref self: TContractState, id: u256, asset_id: u256);
    fn get_linked_assets(self: @TContractState, id: u256) -> Array<u256>;

    // Verification and certification
    fn verify_ip_id(ref self: TContractState, id: u256, level: u8);

    // Community features
    fn create_community(ref self: TContractState, name: ByteArray) -> u256;
    fn join_community(ref self: TContractState, community_id: u256);
    fn get_community_members(self: @TContractState, community_id: u256) -> Array<u256>;
    fn is_community_member(
        self: @TContractState, user: ContractAddress, community_id: u256,
    ) -> bool;

    // Access control
    fn set_permission(ref self: TContractState, id: u256, feature_id: u8, has_access: bool);
    fn has_permission(self: @TContractState, id: u256, feature_id: u8) -> bool;

    // Pause/unpause
    fn set_paused(ref self: TContractState, paused: bool);
}
