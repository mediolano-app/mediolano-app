// src/interfaces.cairo

use starknet::ContractAddress;
use array::Array;
use core::traits::Into;

#[starknet::interface]
trait IERC721<TContractState> {
    fn name(self: @TContractState) -> felt252;
    fn symbol(self: @TContractState) -> felt252;
    fn token_uri(self: @TContractState, token_id: u256) -> ByteArray;
    fn owner_of(self: @TContractState, token_id: u256) -> ContractAddress;
    fn transfer_from(ref self: TContractState, from: ContractAddress, to: ContractAddress, token_id: u256);
    fn safe_transfer_from(
        ref self: TContractState,
        from: ContractAddress,
        to: ContractAddress,
        token_id: u256,
        data: Span<felt252>
    );
    fn approve(ref self: TContractState, approved: ContractAddress, token_id: u256);
    fn set_approval_for_all(ref self: TContractState, operator: ContractAddress, approved: bool);
    fn get_approved(self: @TContractState, token_id: u256) -> ContractAddress;
    fn is_approved_for_all(
        self: @TContractState, owner: ContractAddress, operator: ContractAddress
    ) -> bool;
}

#[starknet::interface]
trait IIPFSManager<TContractState> {
    fn pin_to_ipfs(ref self: TContractState, data: ByteArray) -> ByteArray;
    fn validate_ipfs_hash(self: @TContractState, hash: ByteArray) -> bool;
    fn get_ipfs_gateway(self: @TContractState) -> ByteArray;
    fn set_ipfs_gateway(ref self: TContractState, gateway: ByteArray);
}

#[starknet::interface]
trait IAccessControl<TContractState> {
    fn has_role(self: @TContractState, role: felt252, account: ContractAddress) -> bool;
    fn get_role_admin(self: @TContractState, role: felt252) -> felt252;
    fn grant_role(ref self: TContractState, role: felt252, account: ContractAddress);
    fn revoke_role(ref self: TContractState, role: felt252, account: ContractAddress);
    fn renounce_role(ref self: TContractState, role: felt252, account: ContractAddress);
}

#[starknet::interface]
trait IDataImporter<TContractState> {
    fn import_from_file(
        ref self: TContractState,
        file_data: Array<felt252>,
        import_type: ImportType,
        additional_metadata: ByteArray
    ) -> Array<u256>;
    fn get_import_status(self: @TContractState, import_id: u256) -> ImportStatus;
    fn get_import_history(self: @TContractState, account: ContractAddress) -> Array<ImportData>;
}

#[starknet::interface]
trait IBatchProcessor<TContractState> {
    fn process_batch(
        ref self: TContractState, 
        batch_data: Array<IPAssetData>,
        batch_metadata: ByteArray
    ) -> BatchResult;
    fn get_batch_status(self: @TContractState, batch_id: u256) -> BatchStatus;
}