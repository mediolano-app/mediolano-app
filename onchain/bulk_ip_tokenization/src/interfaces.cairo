
use starknet::ContractAddress;
use super::types::{
    IPAssetData, 
    LicenseTerms, 
};

#[starknet::interface]
pub trait IIPNFT<TState> {
    fn balanceOf(self: @TState, account: ContractAddress) -> u256;
    fn ownerOf(self: @TState, token_id: u256) -> ContractAddress;
    fn safeTransferFrom(
        ref self: TState,
        from: ContractAddress,
        to: ContractAddress,
        token_id: u256,
        data: Span<felt252>
    );
    fn transferFrom(ref self: TState, from: ContractAddress, to: ContractAddress, token_id: u256);
    fn setApprovalForAll(ref self: TState, operator: ContractAddress, approved: bool);
    fn getApproved(self: @TState, token_id: u256) -> ContractAddress;
    fn isApprovedForAll(self: @TState, owner: ContractAddress, operator: ContractAddress) -> bool;
    fn mint(ref self: TState, to: ContractAddress) -> u256;
    fn burn(ref self: TState, token_id: u256) -> bool;
    fn has_any_IPNFT(self: @TState, address: ContractAddress) -> bool;
}

#[starknet::interface]
pub trait IIPFSManager<TContractState> {
    fn pin_to_ipfs(ref self: TContractState, data: ByteArray) -> ByteArray;
    fn validate_ipfs_hash(self: @TContractState, hash: ByteArray) -> bool;
    fn get_ipfs_gateway(self: @TContractState) -> ByteArray;
    fn set_ipfs_gateway(ref self: TContractState, gateway: ByteArray);
}

#[starknet::interface]
pub trait IAccessControl<TContractState> {
    fn has_role(self: @TContractState, role: felt252, account: ContractAddress) -> bool;
    fn get_role_admin(self: @TContractState, role: felt252) -> felt252;
    fn grant_role(ref self: TContractState, role: felt252, account: ContractAddress);
    fn revoke_role(ref self: TContractState, role: felt252, account: ContractAddress);
    fn renounce_role(ref self: TContractState, role: felt252, account: ContractAddress);
}

// #[starknet::interface]
// pub trait IDataImporter<TContractState> {
//     fn import_from_file(
//         ref self: TContractState,
//         file_data: Array<felt252>,
//         import_type: ImportType,
//         additional_metadata: ByteArray
//     ) -> Array<u256>;
//     fn get_import_status(self: @TContractState, import_id: u256) -> ImportStatus;
//     fn get_import_history(self: @TContractState, account: ContractAddress) -> Array<ImportData>;
// }

// #[starknet::interface]
// pub trait IBatchProcessor<TContractState> {
//     fn process_batch(
//         ref self: TContractState, 
//         batch_data: Array<IPAssetData>,
//         batch_metadata: ByteArray
//     ) -> BatchResult;
//     fn get_batch_status(self: @TContractState, batch_id: u256) -> BatchStatus;
// }

#[starknet::interface]
pub trait IBulkIPTokenizer<TContractState> {
    fn bulk_tokenize(ref self: TContractState, assets: Array<IPAssetData>) -> Array<u256>;
    fn get_token_metadata(self: @TContractState, token_id: u256) -> IPAssetData;
    fn get_token_owner(self: @TContractState, token_id: u256) -> ContractAddress;
    fn get_token_expiry(self: @TContractState, token_id: u256) -> u64;
    fn update_metadata(ref self: TContractState, token_id: u256, new_metadata: ByteArray);
    fn update_license_terms(ref self: TContractState, token_id: u256, new_terms: LicenseTerms);
    fn transfer_token(ref self: TContractState, token_id: u256, to: ContractAddress);
}