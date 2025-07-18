export const abi = [
  {
    type: "impl",
    name: "UpgradeableImpl",
    interface_name: "openzeppelin_upgrades::interface::IUpgradeable",
  },
  {
    type: "interface",
    name: "openzeppelin_upgrades::interface::IUpgradeable",
    items: [
      {
        type: "function",
        name: "upgrade",
        inputs: [
          {
            name: "new_class_hash",
            type: "core::starknet::class_hash::ClassHash",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "IPCollectionImpl",
    interface_name:
      "ip_collection_erc_721::interfaces::IIPCollection::IIPCollection",
  },
  {
    type: "struct",
    name: "core::byte_array::ByteArray",
    members: [
      {
        name: "data",
        type: "core::array::Array::<core::bytes_31::bytes31>",
      },
      {
        name: "pending_word",
        type: "core::felt252",
      },
      {
        name: "pending_word_len",
        type: "core::integer::u32",
      },
    ],
  },
  {
    type: "struct",
    name: "core::integer::u256",
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
    type: "struct",
    name: "core::array::Span::<core::integer::u256>",
    members: [
      {
        name: "snapshot",
        type: "@core::array::Array::<core::integer::u256>",
      },
    ],
  },
  {
    type: "enum",
    name: "core::bool",
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
    type: "struct",
    name: "ip_collection_erc_721::types::Collection",
    members: [
      {
        name: "name",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "symbol",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "base_uri",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "ip_nft",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "is_active",
        type: "core::bool",
      },
    ],
  },
  {
    type: "struct",
    name: "ip_collection_erc_721::types::CollectionStats",
    members: [
      {
        name: "total_minted",
        type: "core::integer::u256",
      },
      {
        name: "total_burned",
        type: "core::integer::u256",
      },
      {
        name: "total_transfers",
        type: "core::integer::u256",
      },
      {
        name: "last_mint_time",
        type: "core::integer::u64",
      },
      {
        name: "last_burn_time",
        type: "core::integer::u64",
      },
      {
        name: "last_transfer_time",
        type: "core::integer::u64",
      },
    ],
  },
  {
    type: "struct",
    name: "ip_collection_erc_721::types::TokenData",
    members: [
      {
        name: "collection_id",
        type: "core::integer::u256",
      },
      {
        name: "token_id",
        type: "core::integer::u256",
      },
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "metadata_uri",
        type: "core::byte_array::ByteArray",
      },
    ],
  },
  {
    type: "interface",
    name: "ip_collection_erc_721::interfaces::IIPCollection::IIPCollection",
    items: [
      {
        type: "function",
        name: "create_collection",
        inputs: [
          {
            name: "name",
            type: "core::byte_array::ByteArray",
          },
          {
            name: "symbol",
            type: "core::byte_array::ByteArray",
          },
          {
            name: "base_uri",
            type: "core::byte_array::ByteArray",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "mint",
        inputs: [
          {
            name: "collection_id",
            type: "core::integer::u256",
          },
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "batch_mint",
        inputs: [
          {
            name: "collection_id",
            type: "core::integer::u256",
          },
          {
            name: "recipients",
            type: "core::array::Array::<core::starknet::contract_address::ContractAddress>",
          },
        ],
        outputs: [
          {
            type: "core::array::Span::<core::integer::u256>",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "burn",
        inputs: [
          {
            name: "token",
            type: "core::byte_array::ByteArray",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "batch_burn",
        inputs: [
          {
            name: "tokens",
            type: "core::array::Array::<core::byte_array::ByteArray>",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "transfer_token",
        inputs: [
          {
            name: "from",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "to",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token",
            type: "core::byte_array::ByteArray",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "batch_transfer",
        inputs: [
          {
            name: "from",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "to",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "tokens",
            type: "core::array::Array::<core::byte_array::ByteArray>",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "list_user_tokens_per_collection",
        inputs: [
          {
            name: "collection_id",
            type: "core::integer::u256",
          },
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::array::Span::<core::integer::u256>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "list_user_collections",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::array::Span::<core::integer::u256>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_collection",
        inputs: [
          {
            name: "collection_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "ip_collection_erc_721::types::Collection",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "is_valid_collection",
        inputs: [
          {
            name: "collection_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_collection_stats",
        inputs: [
          {
            name: "collection_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "ip_collection_erc_721::types::CollectionStats",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "is_collection_owner",
        inputs: [
          {
            name: "collection_id",
            type: "core::integer::u256",
          },
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_token",
        inputs: [
          {
            name: "token",
            type: "core::byte_array::ByteArray",
          },
        ],
        outputs: [
          {
            type: "ip_collection_erc_721::types::TokenData",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "is_valid_token",
        inputs: [
          {
            name: "token",
            type: "core::byte_array::ByteArray",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "impl",
    name: "OwnableMixinImpl",
    interface_name: "openzeppelin_access::ownable::interface::OwnableABI",
  },
  {
    type: "interface",
    name: "openzeppelin_access::ownable::interface::OwnableABI",
    items: [
      {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "transfer_ownership",
        inputs: [
          {
            name: "new_owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "renounce_ownership",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "transferOwnership",
        inputs: [
          {
            name: "newOwner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "renounceOwnership",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "ip_nft_class_hash",
        type: "core::starknet::class_hash::ClassHash",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_introspection::src5::SRC5Component::Event",
    kind: "enum",
    variants: [],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    kind: "struct",
    members: [
      {
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    kind: "struct",
    members: [
      {
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "OwnershipTransferred",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        kind: "nested",
      },
      {
        name: "OwnershipTransferStarted",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    kind: "struct",
    members: [
      {
        name: "class_hash",
        type: "core::starknet::class_hash::ClassHash",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "Upgraded",
        type: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "ip_collection_erc_721::IPCollection::IPCollection::CollectionCreated",
    kind: "struct",
    members: [
      {
        name: "collection_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "name",
        type: "core::byte_array::ByteArray",
        kind: "data",
      },
      {
        name: "symbol",
        type: "core::byte_array::ByteArray",
        kind: "data",
      },
      {
        name: "base_uri",
        type: "core::byte_array::ByteArray",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "ip_collection_erc_721::IPCollection::IPCollection::CollectionUpdated",
    kind: "struct",
    members: [
      {
        name: "collection_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "name",
        type: "core::byte_array::ByteArray",
        kind: "data",
      },
      {
        name: "symbol",
        type: "core::byte_array::ByteArray",
        kind: "data",
      },
      {
        name: "base_uri",
        type: "core::byte_array::ByteArray",
        kind: "data",
      },
      {
        name: "timestamp",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "ip_collection_erc_721::IPCollection::IPCollection::TokenMinted",
    kind: "struct",
    members: [
      {
        name: "collection_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "token_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "metadata_uri",
        type: "core::byte_array::ByteArray",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "ip_collection_erc_721::IPCollection::IPCollection::TokenMintedBatch",
    kind: "struct",
    members: [
      {
        name: "collection_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "token_ids",
        type: "core::array::Span::<core::integer::u256>",
        kind: "data",
      },
      {
        name: "owners",
        type: "core::array::Array::<core::starknet::contract_address::ContractAddress>",
        kind: "data",
      },
      {
        name: "operator",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "timestamp",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "ip_collection_erc_721::IPCollection::IPCollection::TokenBurned",
    kind: "struct",
    members: [
      {
        name: "collection_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "token_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "operator",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "timestamp",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "ip_collection_erc_721::IPCollection::IPCollection::TokenBurnedBatch",
    kind: "struct",
    members: [
      {
        name: "tokens",
        type: "core::array::Array::<core::byte_array::ByteArray>",
        kind: "data",
      },
      {
        name: "operator",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "timestamp",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "ip_collection_erc_721::IPCollection::IPCollection::TokenTransferred",
    kind: "struct",
    members: [
      {
        name: "collection_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "token_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "operator",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "timestamp",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "ip_collection_erc_721::IPCollection::IPCollection::TokenTransferredBatch",
    kind: "struct",
    members: [
      {
        name: "from",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "to",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "tokens",
        type: "core::array::Array::<core::byte_array::ByteArray>",
        kind: "data",
      },
      {
        name: "operator",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "timestamp",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "ip_collection_erc_721::IPCollection::IPCollection::Event",
    kind: "enum",
    variants: [
      {
        name: "SRC5Event",
        type: "openzeppelin_introspection::src5::SRC5Component::Event",
        kind: "flat",
      },
      {
        name: "OwnableEvent",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
        kind: "flat",
      },
      {
        name: "UpgradeableEvent",
        type: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
        kind: "flat",
      },
      {
        name: "CollectionCreated",
        type: "ip_collection_erc_721::IPCollection::IPCollection::CollectionCreated",
        kind: "nested",
      },
      {
        name: "CollectionUpdated",
        type: "ip_collection_erc_721::IPCollection::IPCollection::CollectionUpdated",
        kind: "nested",
      },
      {
        name: "TokenMinted",
        type: "ip_collection_erc_721::IPCollection::IPCollection::TokenMinted",
        kind: "nested",
      },
      {
        name: "TokenMintedBatch",
        type: "ip_collection_erc_721::IPCollection::IPCollection::TokenMintedBatch",
        kind: "nested",
      },
      {
        name: "TokenBurned",
        type: "ip_collection_erc_721::IPCollection::IPCollection::TokenBurned",
        kind: "nested",
      },
      {
        name: "TokenBurnedBatch",
        type: "ip_collection_erc_721::IPCollection::IPCollection::TokenBurnedBatch",
        kind: "nested",
      },
      {
        name: "TokenTransferred",
        type: "ip_collection_erc_721::IPCollection::IPCollection::TokenTransferred",
        kind: "nested",
      },
      {
        name: "TokenTransferredBatch",
        type: "ip_collection_erc_721::IPCollection::IPCollection::TokenTransferredBatch",
        kind: "nested",
      },
    ],
  },
] as const;
