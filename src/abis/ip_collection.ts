export const ipCollectionAbi = [
    {
      "type": "impl",
      "name": "UpgradeableImpl",
      "interface_name": "openzeppelin_upgrades::interface::IUpgradeable"
    },
    {
      "type": "interface",
      "name": "openzeppelin_upgrades::interface::IUpgradeable",
      "items": [
        {
          "type": "function",
          "name": "upgrade",
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
      "type": "impl",
      "name": "IPCollection",
      "interface_name": "ip_collection_erc_721::IPCollection::IIPCollection"
    },
    {
      "type": "struct",
      "name": "core::byte_array::ByteArray",
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
      "type": "struct",
      "name": "core::integer::u256",
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
      "type": "enum",
      "name": "core::bool",
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
      "type": "struct",
      "name": "ip_collection_erc_721::IPCollection::Collection",
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
          "name": "is_active",
          "type": "core::bool"
        }
      ]
    },
    {
      "type": "struct",
      "name": "ip_collection_erc_721::IPCollection::Token",
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
      "type": "struct",
      "name": "ip_collection_erc_721::IPCollection::CollectionStats",
      "members": [
        {
          "name": "total_supply",
          "type": "core::integer::u256"
        },
        {
          "name": "minted",
          "type": "core::integer::u256"
        },
        {
          "name": "burned",
          "type": "core::integer::u256"
        },
        {
          "name": "last_mint_batch_id",
          "type": "core::integer::u256"
        },
        {
          "name": "last_mint_time",
          "type": "core::integer::u64"
        }
      ]
    },
    {
      "type": "interface",
      "name": "ip_collection_erc_721::IPCollection::IIPCollection",
      "items": [
        {
          "type": "function",
          "name": "create_collection",
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
          "type": "function",
          "name": "mint",
          "inputs": [
            {
              "name": "collection_id",
              "type": "core::integer::u256"
            },
            {
              "name": "recipient",
              "type": "core::starknet::contract_address::ContractAddress"
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
          "type": "function",
          "name": "burn",
          "inputs": [
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "list_user_tokens",
          "inputs": [
            {
              "name": "owner",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::array::Array::<core::integer::u256>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "transfer_token",
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
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "list_user_collections",
          "inputs": [
            {
              "name": "owner",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::array::Array::<core::integer::u256>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_collection",
          "inputs": [
            {
              "name": "collection_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "ip_collection_erc_721::IPCollection::Collection"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_token",
          "inputs": [
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "ip_collection_erc_721::IPCollection::Token"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "list_all_tokens",
          "inputs": [],
          "outputs": [
            {
              "type": "core::array::Array::<core::integer::u256>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "list_collection_tokens",
          "inputs": [
            {
              "name": "collection_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::array::Array::<core::integer::u256>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "mint_batch",
          "inputs": [
            {
              "name": "collection_id",
              "type": "core::integer::u256"
            },
            {
              "name": "recipients",
              "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
            }
          ],
          "outputs": [
            {
              "type": "core::array::Array::<core::integer::u256>"
            }
          ],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "burn_batch",
          "inputs": [
            {
              "name": "token_ids",
              "type": "core::array::Array::<core::integer::u256>"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "transfer_batch",
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
              "name": "token_ids",
              "type": "core::array::Array::<core::integer::u256>"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "update_collection_metadata",
          "inputs": [
            {
              "name": "collection_id",
              "type": "core::integer::u256"
            },
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
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_collection_stats",
          "inputs": [
            {
              "name": "collection_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "ip_collection_erc_721::IPCollection::CollectionStats"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "is_valid_collection",
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
          "type": "function",
          "name": "is_valid_token",
          "inputs": [
            {
              "name": "token_id",
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
          "type": "function",
          "name": "is_collection_owner",
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
        }
      ]
    },
    {
      "type": "impl",
      "name": "ERC721MixinImpl",
      "interface_name": "openzeppelin_token::erc721::interface::ERC721ABI"
    },
    {
      "type": "struct",
      "name": "core::array::Span::<core::felt252>",
      "members": [
        {
          "name": "snapshot",
          "type": "@core::array::Array::<core::felt252>"
        }
      ]
    },
    {
      "type": "interface",
      "name": "openzeppelin_token::erc721::interface::ERC721ABI",
      "items": [
        {
          "type": "function",
          "name": "balance_of",
          "inputs": [
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "owner_of",
          "inputs": [
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "safe_transfer_from",
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
              "name": "token_id",
              "type": "core::integer::u256"
            },
            {
              "name": "data",
              "type": "core::array::Span::<core::felt252>"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "transfer_from",
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
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "approve",
          "inputs": [
            {
              "name": "to",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "set_approval_for_all",
          "inputs": [
            {
              "name": "operator",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "approved",
              "type": "core::bool"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_approved",
          "inputs": [
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "is_approved_for_all",
          "inputs": [
            {
              "name": "owner",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "operator",
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
          "type": "function",
          "name": "supports_interface",
          "inputs": [
            {
              "name": "interface_id",
              "type": "core::felt252"
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
          "type": "function",
          "name": "name",
          "inputs": [],
          "outputs": [
            {
              "type": "core::byte_array::ByteArray"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "symbol",
          "inputs": [],
          "outputs": [
            {
              "type": "core::byte_array::ByteArray"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "token_uri",
          "inputs": [
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::byte_array::ByteArray"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "balanceOf",
          "inputs": [
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "ownerOf",
          "inputs": [
            {
              "name": "tokenId",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "safeTransferFrom",
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
              "name": "tokenId",
              "type": "core::integer::u256"
            },
            {
              "name": "data",
              "type": "core::array::Span::<core::felt252>"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "transferFrom",
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
              "name": "tokenId",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "setApprovalForAll",
          "inputs": [
            {
              "name": "operator",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "approved",
              "type": "core::bool"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "getApproved",
          "inputs": [
            {
              "name": "tokenId",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "isApprovedForAll",
          "inputs": [
            {
              "name": "owner",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "operator",
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
          "type": "function",
          "name": "tokenURI",
          "inputs": [
            {
              "name": "tokenId",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::byte_array::ByteArray"
            }
          ],
          "state_mutability": "view"
        }
      ]
    },
    {
      "type": "impl",
      "name": "OwnableMixinImpl",
      "interface_name": "openzeppelin_access::ownable::interface::OwnableABI"
    },
    {
      "type": "interface",
      "name": "openzeppelin_access::ownable::interface::OwnableABI",
      "items": [
        {
          "type": "function",
          "name": "owner",
          "inputs": [],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "transfer_ownership",
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
          "type": "function",
          "name": "renounce_ownership",
          "inputs": [],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "transferOwnership",
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
          "type": "function",
          "name": "renounceOwnership",
          "inputs": [],
          "outputs": [],
          "state_mutability": "external"
        }
      ]
    },
    {
      "type": "impl",
      "name": "ERC721EnumerableImpl",
      "interface_name": "openzeppelin_token::erc721::extensions::erc721_enumerable::interface::IERC721Enumerable"
    },
    {
      "type": "interface",
      "name": "openzeppelin_token::erc721::extensions::erc721_enumerable::interface::IERC721Enumerable",
      "items": [
        {
          "type": "function",
          "name": "total_supply",
          "inputs": [],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "token_by_index",
          "inputs": [
            {
              "name": "index",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "token_of_owner_by_index",
          "inputs": [
            {
              "name": "owner",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "index",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        }
      ]
    },
    {
      "type": "constructor",
      "name": "constructor",
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
        },
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
      "kind": "struct",
      "members": [
        {
          "name": "from",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "to",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "token_id",
          "type": "core::integer::u256",
          "kind": "key"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
      "kind": "struct",
      "members": [
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "approved",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "token_id",
          "type": "core::integer::u256",
          "kind": "key"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
      "kind": "struct",
      "members": [
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "operator",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "approved",
          "type": "core::bool",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "Transfer",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
          "kind": "nested"
        },
        {
          "name": "Approval",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
          "kind": "nested"
        },
        {
          "name": "ApprovalForAll",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
          "kind": "nested"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_introspection::src5::SRC5Component::Event",
      "kind": "enum",
      "variants": []
    },
    {
      "type": "event",
      "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
      "kind": "struct",
      "members": [
        {
          "name": "previous_owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "new_owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
      "kind": "struct",
      "members": [
        {
          "name": "previous_owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "new_owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "OwnershipTransferred",
          "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
          "kind": "nested"
        },
        {
          "name": "OwnershipTransferStarted",
          "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
          "kind": "nested"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_token::erc721::extensions::erc721_enumerable::erc721_enumerable::ERC721EnumerableComponent::Event",
      "kind": "enum",
      "variants": []
    },
    {
      "type": "event",
      "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
      "kind": "struct",
      "members": [
        {
          "name": "class_hash",
          "type": "core::starknet::class_hash::ClassHash",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "Upgraded",
          "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
          "kind": "nested"
        }
      ]
    },
    {
      "type": "event",
      "name": "ip_collection_erc_721::IPCollection::IPCollection::CollectionCreated",
      "kind": "struct",
      "members": [
        {
          "name": "collection_id",
          "type": "core::integer::u256",
          "kind": "data"
        },
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "name",
          "type": "core::byte_array::ByteArray",
          "kind": "data"
        },
        {
          "name": "symbol",
          "type": "core::byte_array::ByteArray",
          "kind": "data"
        },
        {
          "name": "base_uri",
          "type": "core::byte_array::ByteArray",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "ip_collection_erc_721::IPCollection::IPCollection::CollectionUpdated",
      "kind": "struct",
      "members": [
        {
          "name": "collection_id",
          "type": "core::integer::u256",
          "kind": "data"
        },
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "name",
          "type": "core::byte_array::ByteArray",
          "kind": "data"
        },
        {
          "name": "symbol",
          "type": "core::byte_array::ByteArray",
          "kind": "data"
        },
        {
          "name": "base_uri",
          "type": "core::byte_array::ByteArray",
          "kind": "data"
        },
        {
          "name": "timestamp",
          "type": "core::integer::u64",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "ip_collection_erc_721::IPCollection::IPCollection::TokenMinted",
      "kind": "struct",
      "members": [
        {
          "name": "collection_id",
          "type": "core::integer::u256",
          "kind": "data"
        },
        {
          "name": "token_id",
          "type": "core::integer::u256",
          "kind": "data"
        },
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "metadata_uri",
          "type": "core::byte_array::ByteArray",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "ip_collection_erc_721::IPCollection::IPCollection::TokenMintedBatch",
      "kind": "struct",
      "members": [
        {
          "name": "collection_id",
          "type": "core::integer::u256",
          "kind": "data"
        },
        {
          "name": "token_ids",
          "type": "core::array::Array::<core::integer::u256>",
          "kind": "data"
        },
        {
          "name": "owners",
          "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>",
          "kind": "data"
        },
        {
          "name": "operator",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "timestamp",
          "type": "core::integer::u64",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "ip_collection_erc_721::IPCollection::IPCollection::TokenBurnedBatch",
      "kind": "struct",
      "members": [
        {
          "name": "token_ids",
          "type": "core::array::Array::<core::integer::u256>",
          "kind": "data"
        },
        {
          "name": "operator",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "timestamp",
          "type": "core::integer::u64",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "ip_collection_erc_721::IPCollection::IPCollection::TokenTransferredBatch",
      "kind": "struct",
      "members": [
        {
          "name": "from",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "to",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "token_ids",
          "type": "core::array::Array::<core::integer::u256>",
          "kind": "data"
        },
        {
          "name": "operator",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "timestamp",
          "type": "core::integer::u64",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "ip_collection_erc_721::IPCollection::IPCollection::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "ERC721Event",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::Event",
          "kind": "flat"
        },
        {
          "name": "SRC5Event",
          "type": "openzeppelin_introspection::src5::SRC5Component::Event",
          "kind": "flat"
        },
        {
          "name": "OwnableEvent",
          "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
          "kind": "flat"
        },
        {
          "name": "ERC721EnumerableEvent",
          "type": "openzeppelin_token::erc721::extensions::erc721_enumerable::erc721_enumerable::ERC721EnumerableComponent::Event",
          "kind": "flat"
        },
        {
          "name": "UpgradeableEvent",
          "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
          "kind": "flat"
        },
        {
          "name": "CollectionCreated",
          "type": "ip_collection_erc_721::IPCollection::IPCollection::CollectionCreated",
          "kind": "nested"
        },
        {
          "name": "CollectionUpdated",
          "type": "ip_collection_erc_721::IPCollection::IPCollection::CollectionUpdated",
          "kind": "nested"
        },
        {
          "name": "TokenMinted",
          "type": "ip_collection_erc_721::IPCollection::IPCollection::TokenMinted",
          "kind": "nested"
        },
        {
          "name": "TokenMintedBatch",
          "type": "ip_collection_erc_721::IPCollection::IPCollection::TokenMintedBatch",
          "kind": "nested"
        },
        {
          "name": "TokenBurnedBatch",
          "type": "ip_collection_erc_721::IPCollection::IPCollection::TokenBurnedBatch",
          "kind": "nested"
        },
        {
          "name": "TokenTransferredBatch",
          "type": "ip_collection_erc_721::IPCollection::IPCollection::TokenTransferredBatch",
          "kind": "nested"
        }
      ]
    }
  ]