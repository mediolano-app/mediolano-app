// src/lib.cairo
mod base {
    mod types;
}
mod interfaces {
    mod IBulkIPTokenizer;
}

#[starknet::contract]
mod IPTokenizer {
    use core::starknet::{
        ContractAddress, get_caller_address, get_block_timestamp, StorageBaseAddress,
        storage_access::{StorageMapRead, StorageMapWrite}
    };
    use core::array::Array;
    use super::base::types::{
        IPAssetData, AssetType, LicenseTerms, INVALID_METADATA, INVALID_ASSET_TYPE,
        INVALID_LICENSE_TERMS, UNAUTHORIZED
    };
    use super::interfaces::IBulkIPTokenizer::IBulkIPTokenizer;
    use core::traits::Into;

    #[storage]
    struct Storage {
        token_counter: u256,
        tokens: LegacyMap::<u256, IPAssetData>,
        token_owner: LegacyMap::<u256, ContractAddress>,
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

    #[external(v0)]
    impl IPTokenizerImpl of IBulkIPTokenizer<ContractState> {
        fn bulk_tokenize(ref self: ContractState, assets: Array<IPAssetData>) -> Array<u256> {
            let mut token_ids: Array<u256> = ArrayTrait::new();
            let mut i: u32 = 0;
            loop {
                if i >= assets.len() {
                    break;
                }
                let asset = assets.at(i);
                let token_id = self._mint(*asset);
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

        fn update_metadata(ref self: ContractState, token_id: u256, new_metadata: ByteArray) {
            assert(self._is_owner(token_id), UNAUTHORIZED);
            let mut asset = self.tokens.read(token_id);
            asset.metadata_uri = new_metadata;
            self.tokens.write(token_id, asset);
        }

        fn update_license_terms(ref self: ContractState, token_id: u256, new_terms: ByteArray) {
            assert(self._is_owner(token_id), UNAUTHORIZED);
            let mut asset = self.tokens.read(token_id);
            asset.license_terms = new_terms;
            self.tokens.write(token_id, asset);
        }

        fn transfer_token(ref self: ContractState, token_id: u256, to: ContractAddress) {
            let from = get_caller_address();
            assert(self._is_owner(token_id), UNAUTHORIZED);
            self.token_owner.write(token_id, to);

            self.emit(TokenTransferred { token_id, from, to });
        }
    }

    #[generate_trait]
    impl Private of PrivateTrait {
        fn _mint(ref self: ContractState, asset: IPAssetData) -> u256 {
            assert(!asset.metadata_uri.is_empty(), INVALID_METADATA);
            assert(self._validate_asset_type(asset.asset_type), INVALID_ASSET_TYPE);
            assert(self._validate_license_terms(asset.license_terms), INVALID_LICENSE_TERMS);

            let token_id = self.token_counter.read() + 1;
            self.token_counter.write(token_id);
            self.tokens.write(token_id, asset.clone());
            self.token_owner.write(token_id, asset.owner);

            self.emit(TokenMinted { token_id, owner: asset.owner });

            token_id
        }

        fn _validate_asset_type(self: @ContractState, asset_type: ByteArray) -> bool {
            match asset_type {
                AssetType::Patent => true,
                AssetType::Trademark => true,
                AssetType::Copyright => true,
                AssetType::TradeSecret => true,
                _ => false,
            }
        }

        fn _validate_license_terms(self: @ContractState, terms: ByteArray) -> bool {
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
