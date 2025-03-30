export const IPMarketplaceABI = [
  {
    name: "IPMarketplaceImpl",
    type: "impl",
    interface_name: "ip_profile_setting::IPMarketplace::IIPMarketplace",
  },
  {
    name: "core::integer::u256",
    type: "struct",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    name: "core::bool",
    type: "enum",
    variants: [
      {
        name: "False",
        type: "()",
      },
      {
        name: "True",
        type: "()",
      },
    ],
  },
  {
    name: "ip_profile_setting::IPMarketplace::IPUsageRights",
    type: "struct",
    members: [
      {
        name: "commercial_use",
        type: "core::bool",
      },
      {
        name: "modifications_allowed",
        type: "core::bool",
      },
      {
        name: "attribution_required",
        type: "core::bool",
      },
      {
        name: "geographic_restrictions",
        type: "core::felt252",
      },
      {
        name: "usage_duration",
        type: "core::integer::u64",
      },
      {
        name: "sublicensing_allowed",
        type: "core::bool",
      },
      {
        name: "industry_restrictions",
        type: "core::felt252",
      },
    ],
  },
  {
    name: "ip_profile_setting::IPMarketplace::DerivativeRights",
    type: "struct",
    members: [
      {
        name: "allowed",
        type: "core::bool",
      },
      {
        name: "royalty_share",
        type: "core::integer::u16",
      },
      {
        name: "requires_approval",
        type: "core::bool",
      },
      {
        name: "max_derivatives",
        type: "core::integer::u32",
      },
    ],
  },
  {
    name: "ip_profile_setting::IPMarketplace::IPMetadata",
    type: "struct",
    members: [
      {
        name: "ipfs_hash",
        type: "core::felt252",
      },
      {
        name: "license_terms",
        type: "core::felt252",
      },
      {
        name: "creator",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "creation_date",
        type: "core::integer::u64",
      },
      {
        name: "last_updated",
        type: "core::integer::u64",
      },
      {
        name: "version",
        type: "core::integer::u32",
      },
      {
        name: "content_type",
        type: "core::felt252",
      },
      {
        name: "derivative_of",
        type: "core::integer::u256",
      },
    ],
  },
  {
    name: "ip_profile_setting::IPMarketplace::Listing",
    type: "struct",
    members: [
      {
        name: "seller",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "nft_contract",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "price",
        type: "core::integer::u256",
      },
      {
        name: "currency",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "active",
        type: "core::bool",
      },
      {
        name: "metadata",
        type: "ip_profile_setting::IPMarketplace::IPMetadata",
      },
      {
        name: "royalty_percentage",
        type: "core::integer::u16",
      },
      {
        name: "usage_rights",
        type: "ip_profile_setting::IPMarketplace::IPUsageRights",
      },
      {
        name: "derivative_rights",
        type: "ip_profile_setting::IPMarketplace::DerivativeRights",
      },
      {
        name: "minimum_purchase_duration",
        type: "core::integer::u64",
      },
      {
        name: "bulk_discount_rate",
        type: "core::integer::u16",
      },
    ],
  },
  {
    name: "ip_profile_setting::IPMarketplace::IIPMarketplace",
    type: "interface",
    items: [
      {
        name: "list_item",
        type: "function",
        inputs: [
          {
            name: "nft_contract",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_id",
            type: "core::integer::u256",
          },
          {
            name: "price",
            type: "core::integer::u256",
          },
          {
            name: "currency_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "metadata_hash",
            type: "core::felt252",
          },
          {
            name: "license_terms_hash",
            type: "core::felt252",
          },
          {
            name: "usage_rights",
            type: "ip_profile_setting::IPMarketplace::IPUsageRights",
          },
          {
            name: "derivative_rights",
            type: "ip_profile_setting::IPMarketplace::DerivativeRights",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "unlist_item",
        type: "function",
        inputs: [
          {
            name: "nft_contract",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "buy_item",
        type: "function",
        inputs: [
          {
            name: "nft_contract",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "update_listing",
        type: "function",
        inputs: [
          {
            name: "nft_contract",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_id",
            type: "core::integer::u256",
          },
          {
            name: "new_price",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "get_listing",
        type: "function",
        inputs: [
          {
            name: "nft_contract",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "ip_profile_setting::IPMarketplace::Listing",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "update_metadata",
        type: "function",
        inputs: [
          {
            name: "nft_contract",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_id",
            type: "core::integer::u256",
          },
          {
            name: "new_metadata_hash",
            type: "core::felt252",
          },
          {
            name: "new_license_terms_hash",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "register_derivative",
        type: "function",
        inputs: [
          {
            name: "nft_contract",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "parent_token_id",
            type: "core::integer::u256",
          },
          {
            name: "metadata_hash",
            type: "core::felt252",
          },
          {
            name: "license_terms_hash",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    name: "constructor",
    type: "constructor",
    inputs: [
      {
        name: "marketplace_fee",
        type: "core::integer::u256",
      },
    ],
  },
  {
    kind: "struct",
    name: "ip_profile_setting::IPMarketplace::ItemListed",
    type: "event",
    members: [
      {
        kind: "key",
        name: "token_id",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "nft_contract",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "seller",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "price",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "currency",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "struct",
    name: "ip_profile_setting::IPMarketplace::ItemUnlisted",
    type: "event",
    members: [
      {
        kind: "key",
        name: "token_id",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "nft_contract",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "struct",
    name: "ip_profile_setting::IPMarketplace::ItemSold",
    type: "event",
    members: [
      {
        kind: "key",
        name: "token_id",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "nft_contract",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "seller",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "buyer",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "price",
        type: "core::integer::u256",
      },
    ],
  },
  {
    kind: "struct",
    name: "ip_profile_setting::IPMarketplace::ListingUpdated",
    type: "event",
    members: [
      {
        kind: "key",
        name: "token_id",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "nft_contract",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "new_price",
        type: "core::integer::u256",
      },
    ],
  },
  {
    kind: "struct",
    name: "ip_profile_setting::IPMarketplace::MetadataUpdated",
    type: "event",
    members: [
      {
        kind: "key",
        name: "token_id",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "nft_contract",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "new_metadata_hash",
        type: "core::felt252",
      },
      {
        kind: "data",
        name: "new_license_terms_hash",
        type: "core::felt252",
      },
      {
        kind: "data",
        name: "updater",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "struct",
    name: "ip_profile_setting::IPMarketplace::DerivativeRegistered",
    type: "event",
    members: [
      {
        kind: "key",
        name: "token_id",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "nft_contract",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "parent_token_id",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "creator",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "enum",
    name: "ip_profile_setting::IPMarketplace::IPMarketplace::Event",
    type: "event",
    variants: [
      {
        kind: "nested",
        name: "ItemListed",
        type: "ip_profile_setting::IPMarketplace::ItemListed",
      },
      {
        kind: "nested",
        name: "ItemUnlisted",
        type: "ip_profile_setting::IPMarketplace::ItemUnlisted",
      },
      {
        kind: "nested",
        name: "ItemSold",
        type: "ip_profile_setting::IPMarketplace::ItemSold",
      },
      {
        kind: "nested",
        name: "ListingUpdated",
        type: "ip_profile_setting::IPMarketplace::ListingUpdated",
      },
      {
        kind: "nested",
        name: "MetadataUpdated",
        type: "ip_profile_setting::IPMarketplace::MetadataUpdated",
      },
      {
        kind: "nested",
        name: "DerivativeRegistered",
        type: "ip_profile_setting::IPMarketplace::DerivativeRegistered",
      },
    ],
  },
] as const;
