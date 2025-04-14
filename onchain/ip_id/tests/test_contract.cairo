use ip_id::IPIdentity::{IIPIdentityDispatcher, IIPIdentityDispatcherTrait, IPIDData};
use snforge_std::{
    declare, ContractClassTrait, DeclareResultTrait, cheat_caller_address, cheat_block_timestamp,
    CheatSpan
};
use starknet::{ContractAddress, contract_address_const};
use core::serde::Serde;

// Helper functions to get test addresses
fn owner() -> ContractAddress {
    contract_address_const::<'owner'>()
}

fn non_owner() -> ContractAddress {
    contract_address_const::<'non_owner'>()
}

fn user() -> ContractAddress {
    contract_address_const::<'user'>()
}

fn dummy_payment_token() -> ContractAddress {
    contract_address_const::<'dummy_payment_token'>()
}

// Helper function to deploy the contract
fn deploy_ip_identity() -> (IIPIdentityDispatcher, ContractAddress) {
    // Declare IPIdentity contract
    let contract_class = declare("IPIdentity").unwrap().contract_class();

    // Prepare constructor calldata
    let owner_addr = owner();
    let name: ByteArray = "IPIdentity";
    let symbol: ByteArray = "IPID";
    let base_uri: ByteArray = "https://ipfs.io/ipfs/";
    let payment_token = dummy_payment_token();

    let mut calldata = array![];
    owner_addr.serialize(ref calldata);
    name.serialize(ref calldata);
    symbol.serialize(ref calldata);
    base_uri.serialize(ref calldata);
    payment_token.serialize(ref calldata);

    // Deploy contract
    let (contract_address, _) = contract_class.deploy(@calldata).unwrap();
    let ip_identity = IIPIdentityDispatcher { contract_address };

    (ip_identity, owner_addr)
}

#[test]
#[should_panic(expected: ('Invalid IP ID',))]
fn test_update_ip_id_metadata_success() {
    let (ip_identity, _) = deploy_ip_identity();
    let caller = user();
    let ip_id = 123;
    let new_metadata_uri: ByteArray = "ipfs://new_metadata";

    cheat_caller_address(ip_identity.contract_address, caller, CheatSpan::TargetCalls(1));
    cheat_block_timestamp(ip_identity.contract_address, 2000, CheatSpan::TargetCalls(1));
    ip_identity.update_ip_id_metadata(ip_id, new_metadata_uri);
}

#[test]
#[should_panic(expected: ('Invalid IP ID',))]
fn test_update_ip_id_metadata_not_owner() {
    let (ip_identity, _) = deploy_ip_identity();
    let non_owner_addr = non_owner();
    let ip_id = 123;

    cheat_caller_address(ip_identity.contract_address, non_owner_addr, CheatSpan::TargetCalls(1));
    ip_identity.update_ip_id_metadata(ip_id, "ipfs://new_metadata");
}

#[test]
#[should_panic(expected: ('Invalid IP ID',))]
fn test_verify_ip_id_success() {
    let (ip_identity, owner_addr) = deploy_ip_identity();
    let ip_id = 123;

    cheat_caller_address(ip_identity.contract_address, owner_addr, CheatSpan::TargetCalls(1));
    cheat_block_timestamp(ip_identity.contract_address, 2000, CheatSpan::TargetCalls(1));
    ip_identity.verify_ip_id(ip_id);
}

#[test]
#[should_panic(expected: ('Caller is not the owner',))]
fn test_verify_ip_id_not_owner() {
    let (ip_identity, _) = deploy_ip_identity();
    let caller = user();
    let ip_id = 123;

    cheat_caller_address(ip_identity.contract_address, caller, CheatSpan::TargetCalls(1));
    ip_identity.verify_ip_id(ip_id);
}

#[test]
fn test_set_payment_token() {
    let (ip_identity, owner_addr) = deploy_ip_identity();
    let new_token = contract_address_const::<'new_token'>();

    cheat_caller_address(ip_identity.contract_address, owner_addr, CheatSpan::TargetCalls(1));
    ip_identity.set_payment_token(new_token);
}

#[test]
#[should_panic(expected: ('Caller is not the owner',))]
fn test_set_payment_token_not_owner() {
    let (ip_identity, _) = deploy_ip_identity();
    let non_owner_addr = non_owner();
    let new_token = contract_address_const::<'new_token'>();

    cheat_caller_address(ip_identity.contract_address, non_owner_addr, CheatSpan::TargetCalls(1));
    ip_identity.set_payment_token(new_token);
}

#[test]
fn test_set_paused() {
    let (ip_identity, owner_addr) = deploy_ip_identity();

    cheat_caller_address(ip_identity.contract_address, owner_addr, CheatSpan::TargetCalls(1));
    ip_identity.set_paused(true);

    cheat_caller_address(ip_identity.contract_address, owner_addr, CheatSpan::TargetCalls(1));
    ip_identity.set_paused(false);
}

#[test]
#[should_panic(expected: ('Caller is not the owner',))]
fn test_set_paused_not_owner() {
    let (ip_identity, _) = deploy_ip_identity();
    let non_owner_addr = non_owner();

    cheat_caller_address(ip_identity.contract_address, non_owner_addr, CheatSpan::TargetCalls(1));
    ip_identity.set_paused(true);
}

#[test]
#[should_panic(expected: ('Invalid IP ID',))]
fn test_get_ip_id_data_invalid_id() {
    let (ip_identity, _) = deploy_ip_identity();
    ip_identity.get_ip_id_data(999);
}

#[test]
#[should_panic(expected: ('Invalid IP ID',))]
fn test_get_owner_by_ip_id_invalid_id() {
    let (ip_identity, _) = deploy_ip_identity();
    ip_identity.get_owner_by_ip_id(999);
}

#[test]
#[should_panic(expected: ('Invalid IP ID',))]
fn test_get_ip_id_by_owner_no_ip() {
    let (ip_identity, _) = deploy_ip_identity();
    let caller = user();
    ip_identity.get_ip_id_by_owner(caller);
}

#[test]
#[should_panic(expected: ('Pausable: paused',))]
fn test_update_ip_id_metadata_when_paused() {
    let (ip_identity, owner_addr) = deploy_ip_identity();
    let caller = user();
    let ip_id = 123;

    // Pause the contract
    cheat_caller_address(ip_identity.contract_address, owner_addr, CheatSpan::TargetCalls(1));
    ip_identity.set_paused(true);

    // Attempt to update metadata
    cheat_caller_address(ip_identity.contract_address, caller, CheatSpan::TargetCalls(1));
    ip_identity.update_ip_id_metadata(ip_id, "ipfs://new_metadata");
}
