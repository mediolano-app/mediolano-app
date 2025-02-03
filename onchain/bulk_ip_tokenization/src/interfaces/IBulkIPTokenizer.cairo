use core::array::Array;
use core::starknet::ContractAddress;
use super::super::base::types::IPAssetData;

#[starknet::interface]
pub trait IBulkIPTokenizer<TContractState> {
    fn bulk_tokenize(ref self: TContractState, assets: Array<IPAssetData>) -> Array<u256>;
    fn get_token_metadata(self: @TContractState, token_id: u256) -> IPAssetData;
    fn get_token_owner(self: @TContractState, token_id: u256) -> ContractAddress;
    fn get_token_expiry(self: @TContractState, token_id: u256) -> u64;
    fn update_metadata(ref self: TContractState, token_id: u256, new_metadata: ByteArray);
    fn update_license_terms(ref self: TContractState, token_id: u256, new_terms: ByteArray);
    fn transfer_token(ref self: TContractState, token_id: u256, to: ContractAddress);
}
