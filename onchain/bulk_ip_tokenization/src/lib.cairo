mod types;


#[starknet::contract]
mod IPTokenizer {
    // Core imports
    use starknet::{
        ContractAddress, get_caller_address
    };
    use starknet::storage::{
        Map, StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapReadAccess, StorageMapWriteAccess
    };
    // Standard library imports
    use core::{
        array::ArrayTrait,
        traits::{Into},
        option::OptionTrait,
    };
    // Project imports
    use super::types::{
        IPAssetData, AssetType, LicenseTerms, INVALID_METADATA, INVALID_ASSET_TYPE,
        INVALID_LICENSE_TERMS, UNAUTHORIZED
    };

    #[storage]
    struct Storage {
        token_counter: u256,
        tokens: Map<u256, IPAssetData>,
        token_owner: Map<u256, ContractAddress>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        TokenMinted: TokenMinted,
        TokenTransferred: TokenTransferred,
    }

    #[derive(Drop, starknet::Event)]
    struct TokenMinted {
        token_id: u256,
        owner: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct TokenTransferred {
        token_id: u256,
        from: ContractAddress,
        to: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.token_counter.write(0);
    }

    #[abi(embed_v0)]
    impl IPTokenizerImpl of IBulkIPTokenizer<ContractState> {
        fn bulk_tokenize(
            ref self: ContractState, 
            assets: Array<IPAssetData>
        ) -> Array<u256> {
            let mut token_ids: Array<u256> = ArrayTrait::new();
            let mut i: u32 = 0;
            let len = assets.len();
            
            loop {
                if i >= len {
                    break;
                }
                let asset = assets.get(i).unwrap().unbox();
                let token_id = self._mint(asset.clone());
                token_ids.append(token_id);
                i += 1;
            };
            
            token_ids
        }

        fn get_token_metadata(self: @ContractState, token_id: u256) -> IPAssetData {
            self.tokens.read(token_id)
        }

        fn get_token_owner(self: @ContractState, token_id: u256) -> ContractAddress {
            self.token_owner.read(token_id)
        }

        fn get_token_expiry(self: @ContractState, token_id: u256) -> u64 {
            let asset = self.tokens.read(token_id);
            asset.expiry_date
        }

        fn update_metadata(
            ref self: ContractState, 
            token_id: u256, 
            new_metadata: ByteArray
        ) {
            assert(self._is_owner(token_id), UNAUTHORIZED);
            let mut asset = self.tokens.read(token_id);
            let updated_asset = IPAssetData {
                metadata_uri: new_metadata,
                ..asset
            };
            self.tokens.write(token_id, updated_asset);
        }

        fn update_license_terms(
            ref self: ContractState, 
            token_id: u256, 
            new_terms: LicenseTerms
        ) {
            assert(self._is_owner(token_id), UNAUTHORIZED);
            let mut asset = self.tokens.read(token_id);
            let mut new_license_terms = asset.license_terms;
            new_license_terms = new_terms;
            self.tokens.write(token_id, asset);
        }

        fn transfer_token(
            ref self: ContractState, 
            token_id: u256, 
            to: ContractAddress
        ) {
            let from = get_caller_address();
            assert(self._is_owner(token_id), UNAUTHORIZED);
            self.token_owner.write(token_id, to);

            self.emit(TokenTransferred { token_id, from, to });
        }
    }


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


    #[generate_trait]
    impl Private of PrivateTrait {
        fn _mint(ref self: ContractState, asset: IPAssetData) -> u256 {
            assert(asset.metadata_uri.len() != 0, INVALID_METADATA);
            assert(self._validate_asset_type(asset.asset_type), INVALID_ASSET_TYPE);
            assert(self._validate_license_terms(asset.license_terms), INVALID_LICENSE_TERMS);

            let token_id = self.token_counter.read() + 1;
            self.token_counter.write(token_id);
            self.token_owner.write(token_id, asset.owner);

            self.emit(TokenMinted { token_id, owner: asset.owner });

            token_id
        }

        fn _validate_asset_type(self: @ContractState, asset_type: AssetType) -> bool {
            match asset_type {
                AssetType::Patent => true,
                AssetType::Trademark => true,
                AssetType::Copyright => true,
                AssetType::TradeSecret => true,
                _ => false,
            }
        }

        fn _validate_license_terms(self: @ContractState, terms: LicenseTerms) -> bool {
            match terms {
                LicenseTerms::Standard => true,
                LicenseTerms::Premium => true,
                LicenseTerms::Exclusive => true,
                LicenseTerms::Custom => true,
                _ => false,
            }
        }

        fn _is_owner(self: @ContractState, token_id: u256) -> bool {
            let caller = get_caller_address();
            let owner = self.token_owner.read(token_id);
            caller == owner
        }
    }
}