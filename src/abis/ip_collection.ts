export const ipCollectionAbi = [
  {
    "name": "UpgradeableImpl",
    "type": "impl",
    "interface_name": "openzeppelin_upgrades::interface::IUpgradeable"
  },
  {
    "name": "openzeppelin_upgrades::interface::IUpgradeable",
    "type": "interface",
    "items": [
      {
        "name": "upgrade",
        "type": "function",
        "inputs": [
          {
            "name": "new_class_hash",
            "type": "core::starknet::class_hash::ClassHash"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "IPCollectionImpl",
    "type": "impl",
    "interface_name": "ip_collection_erc_721::interfaces::IIPCollection::IIPCollection"
  },
  {
    "name": "core::byte_array::ByteArray",
    "type": "struct",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "name": "core::integer::u256",
    "type": "struct",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "name": "core::array::Span::<core::integer::u256>",
    "type": "struct",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<core::integer::u256>"
      }
    ]
  },
  {
    "name": "core::bool",
    "type": "enum",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "name": "ip_collection_erc_721::types::Collection",
    "type": "struct",
    "members": [
      {
        "name": "name",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "symbol",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "base_uri",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "ip_nft",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "is_active",
        "type": "core::bool"
      }
    ]
  },
  {
    "name": "ip_collection_erc_721::types::CollectionStats",
    "type": "struct",
    "members": [
      {
        "name": "total_minted",
        "type": "core::integer::u256"
      },
      {
        "name": "total_burned",
        "type": "core::integer::u256"
      },
      {
        "name": "total_transfers",
        "type": "core::integer::u256"
      },
      {
        "name": "last_mint_time",
        "type": "core::integer::u64"
      },
      {
        "name": "last_burn_time",
        "type": "core::integer::u64"
      },
      {
        "name": "last_transfer_time",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "name": "ip_collection_erc_721::types::TokenData",
    "type": "struct",
    "members": [
      {
        "name": "collection_id",
        "type": "core::integer::u256"
      },
      {
        "name": "token_id",
        "type": "core::integer::u256"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "metadata_uri",
        "type": "core::byte_array::ByteArray"
      }
    ]
  },
  {
    "name": "ip_collection_erc_721::interfaces::IIPCollection::IIPCollection",
    "type": "interface",
    "items": [
      {
        "name": "create_collection",
        "type": "function",
        "inputs": [
          {
            "name": "name",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "symbol",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "base_uri",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "mint",
        "type": "function",
        "inputs": [
          {
            "name": "collection_id",
            "type": "core::integer::u256"
          },
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "token_uri",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "batch_mint",
        "type": "function",
        "inputs": [
          {
            "name": "collection_id",
            "type": "core::integer::u256"
          },
          {
            "name": "recipients",
            "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
          },
          {
            "name": "token_uris",
            "type": "core::array::Array::<core::byte_array::ByteArray>"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Span::<core::integer::u256>"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "burn",
        "type": "function",
        "inputs": [
          {
            "name": "token",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "batch_burn",
        "type": "function",
        "inputs": [
          {
            "name": "tokens",
            "type": "core::array::Array::<core::byte_array::ByteArray>"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "transfer_token",
        "type": "function",
        "inputs": [
          {
            "name": "from",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "token",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "batch_transfer",
        "type": "function",
        "inputs": [
          {
            "name": "from",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "tokens",
            "type": "core::array::Array::<core::byte_array::ByteArray>"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "list_user_tokens_per_collection",
        "type": "function",
        "inputs": [
          {
            "name": "collection_id",
            "type": "core::integer::u256"
          },
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Span::<core::integer::u256>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "list_user_collections",
        "type": "function",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Span::<core::integer::u256>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_collection",
        "type": "function",
        "inputs": [
          {
            "name": "collection_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "ip_collection_erc_721::types::Collection"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "is_valid_collection",
        "type": "function",
        "inputs": [
          {
            "name": "collection_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_collection_stats",
        "type": "function",
        "inputs": [
          {
            "name": "collection_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "ip_collection_erc_721::types::CollectionStats"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "is_collection_owner",
        "type": "function",
        "inputs": [
          {
            "name": "collection_id",
            "type": "core::integer::u256"
          },
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_token",
        "type": "function",
        "inputs": [
          {
            "name": "token",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [
          {
            "type": "ip_collection_erc_721::types::TokenData"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "is_valid_token",
        "type": "function",
        "inputs": [
          {
            "name": "token",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "upgrade_ip_nft_class_hash",
        "type": "function",
        "inputs": [
          {
            "name": "new_nft_class_hash",
            "type": "core::starknet::class_hash::ClassHash"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "OwnableMixinImpl",
    "type": "impl",
    "interface_name": "openzeppelin_access::ownable::interface::OwnableABI"
  },
  {
    "name": "openzeppelin_access::ownable::interface::OwnableABI",
    "type": "interface",
    "items": [
      {
        "name": "owner",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "transfer_ownership",
        "type": "function",
        "inputs": [
          {
            "name": "new_owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "renounce_ownership",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "transferOwnership",
        "type": "function",
        "inputs": [
          {
            "name": "newOwner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "renounceOwnership",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "ip_nft_class_hash",
        "type": "core::starknet::class_hash::ClassHash"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_introspection::src5::SRC5Component::Event",
    "type": "event",
    "variants": []
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "OwnershipTransferred",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred"
      },
      {
        "kind": "nested",
        "name": "OwnershipTransferStarted",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "class_hash",
        "type": "core::starknet::class_hash::ClassHash"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Upgraded",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "ip_collection_erc_721::IPCollection::IPCollection::CollectionCreated",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "collection_id",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "name",
        "type": "core::byte_array::ByteArray"
      },
      {
        "kind": "data",
        "name": "symbol",
        "type": "core::byte_array::ByteArray"
      },
      {
        "kind": "data",
        "name": "base_uri",
        "type": "core::byte_array::ByteArray"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "ip_collection_erc_721::IPCollection::IPCollection::CollectionUpdated",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "collection_id",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "name",
        "type": "core::byte_array::ByteArray"
      },
      {
        "kind": "data",
        "name": "symbol",
        "type": "core::byte_array::ByteArray"
      },
      {
        "kind": "data",
        "name": "base_uri",
        "type": "core::byte_array::ByteArray"
      },
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "ip_collection_erc_721::IPCollection::IPCollection::TokenMinted",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "collection_id",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "token_id",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "metadata_uri",
        "type": "core::byte_array::ByteArray"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "ip_collection_erc_721::IPCollection::IPCollection::TokenMintedBatch",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "collection_id",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "token_ids",
        "type": "core::array::Span::<core::integer::u256>"
      },
      {
        "kind": "data",
        "name": "owners",
        "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
      },
      {
        "kind": "data",
        "name": "operator",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "ip_collection_erc_721::IPCollection::IPCollection::TokenBurned",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "collection_id",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "token_id",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "operator",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "ip_collection_erc_721::IPCollection::IPCollection::TokenBurnedBatch",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "tokens",
        "type": "core::array::Array::<core::byte_array::ByteArray>"
      },
      {
        "kind": "data",
        "name": "operator",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "ip_collection_erc_721::IPCollection::IPCollection::TokenTransferred",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "collection_id",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "token_id",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "operator",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "ip_collection_erc_721::IPCollection::IPCollection::TokenTransferredBatch",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "from",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "to",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "tokens",
        "type": "core::array::Array::<core::byte_array::ByteArray>"
      },
      {
        "kind": "data",
        "name": "operator",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "ip_collection_erc_721::IPCollection::IPCollection::Event",
    "type": "event",
    "variants": [
      {
        "kind": "flat",
        "name": "SRC5Event",
        "type": "openzeppelin_introspection::src5::SRC5Component::Event"
      },
      {
        "kind": "flat",
        "name": "OwnableEvent",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "UpgradeableEvent",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event"
      },
      {
        "kind": "nested",
        "name": "CollectionCreated",
        "type": "ip_collection_erc_721::IPCollection::IPCollection::CollectionCreated"
      },
      {
        "kind": "nested",
        "name": "CollectionUpdated",
        "type": "ip_collection_erc_721::IPCollection::IPCollection::CollectionUpdated"
      },
      {
        "kind": "nested",
        "name": "TokenMinted",
        "type": "ip_collection_erc_721::IPCollection::IPCollection::TokenMinted"
      },
      {
        "kind": "nested",
        "name": "TokenMintedBatch",
        "type": "ip_collection_erc_721::IPCollection::IPCollection::TokenMintedBatch"
      },
      {
        "kind": "nested",
        "name": "TokenBurned",
        "type": "ip_collection_erc_721::IPCollection::IPCollection::TokenBurned"
      },
      {
        "kind": "nested",
        "name": "TokenBurnedBatch",
        "type": "ip_collection_erc_721::IPCollection::IPCollection::TokenBurnedBatch"
      },
      {
        "kind": "nested",
        "name": "TokenTransferred",
        "type": "ip_collection_erc_721::IPCollection::IPCollection::TokenTransferred"
      },
      {
        "kind": "nested",
        "name": "TokenTransferredBatch",
        "type": "ip_collection_erc_721::IPCollection::IPCollection::TokenTransferredBatch"
      }
    ]
  }
];