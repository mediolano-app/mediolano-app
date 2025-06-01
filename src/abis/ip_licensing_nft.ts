export default [
    {
        "type": "impl",
        "name": "IPLicensingImpl",
        "interface_name": "ip_licensing::interfaces::IIPLicensingNFT::IIPLicensingNFT"
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
        "type": "interface",
        "name": "ip_licensing::interfaces::IIPLicensingNFT::IIPLicensingNFT",
        "items": [
            {
                "type": "function",
                "name": "mint_Licensing_nft",
                "inputs": [
                    {
                        "name": "recipient",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "token_id",
                        "type": "core::integer::u256"
                    },
                    {
                        "name": "new_token_uri",
                        "type": "core::byte_array::ByteArray"
                    },
                    {
                        "name": "license_data",
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
                "name": "get_last_minted_id",
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
                "name": "get_token_mint_timestamp",
                "inputs": [
                    {
                        "name": "token_id",
                        "type": "core::integer::u256"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::integer::u64"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_token_uri",
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
                "name": "get_license_data",
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
                "name": "mint_nft",
                "inputs": [
                    {
                        "name": "recipient",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "new_token_uri",
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
                "name": "get_owner_of_token",
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
            }
        ]
    },
    {
        "type": "constructor",
        "name": "constructor",
        "inputs": [
            {
                "name": "admin",
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
        "name": "ip_licensing::IPLicensingNFT::IPLicensingNFT::Event",
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
            }
        ]
    }
] as const