export default [
    {
        "type": "impl",
        "name": "EncryptedPreferencesRegistryImpl",
        "interface_name": "IEncryptedPreferencesRegistry"
    },
    {
        "type": "struct",
        "name": "EncryptedSetting",
        "members": [
            {
                "name": "data",
                "type": "core::felt252",
                "kind": "data"
            },
            {
                "name": "nonce",
                "type": "core::felt252",
                "kind": "data"
            },
            {
                "name": "pub_key",
                "type": "core::felt252",
                "kind": "data"
            },
            {
                "name": "timestamp",
                "type": "core::integer::u64",
                "kind": "data"
            },
            {
                "name": "version",
                "type": "core::felt252",
                "kind": "data"
            }
        ]
    },
    {
        "type": "struct",
        "name": "WalletData",
        "members": [
            {
                "name": "pub_key",
                "type": "core::felt252",
                "kind": "data"
            },
            {
                "name": "version",
                "type": "core::felt252",
                "kind": "data"
            },
            {
                "name": "last_updated",
                "type": "core::integer::u64",
                "kind": "data"
            }
        ]
    },
    {
        "type": "interface",
        "name": "IEncryptedPreferencesRegistry",
        "items": [
            {
                "type": "function",
                "name": "store_setting",
                "inputs": [
                    {
                        "name": "key",
                        "type": "core::felt252"
                    },
                    {
                        "name": "encrypted_data",
                        "type": "core::array::Array::<core::felt252>"
                    },
                    {
                        "name": "wallet_signature",
                        "type": "core::array::Array::<core::felt252>"
                    },
                    {
                        "name": "pub_key",
                        "type": "core::felt252"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "get_setting",
                "inputs": [
                    {
                        "name": "user",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "key",
                        "type": "core::felt252"
                    }
                ],
                "outputs": [
                    {
                        "type": "(core::felt252, core::felt252)"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "remove_setting",
                "inputs": [
                    {
                        "name": "key",
                        "type": "core::felt252"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "update_wallet_key",
                "inputs": [
                    {
                        "name": "new_pub_key",
                        "type": "core::felt252"
                    },
                    {
                        "name": "signature",
                        "type": "core::array::Array::<core::felt252>"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "verify_setting",
                "inputs": [
                    {
                        "name": "user",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "key",
                        "type": "core::felt252"
                    },
                    {
                        "name": "signature",
                        "type": "core::array::Array::<core::felt252>"
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
        "type": "constructor",
        "name": "constructor",
        "inputs": [
            {
                "name": "owner",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "mediolano_app",
                "type": "core::starknet::contract_address::ContractAddress"
            }
        ]
    },
    {
        "type": "event",
        "name": "SettingUpdated",
        "kind": "struct",
        "members": [
            {
                "name": "user",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "key",
                "type": "core::felt252",
                "kind": "data"
            },
            {
                "name": "version",
                "type": "core::felt252",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "SettingRemoved",
        "kind": "struct",
        "members": [
            {
                "name": "user",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "key",
                "type": "core::felt252",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "WalletKeyUpdated",
        "kind": "struct",
        "members": [
            {
                "name": "user",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "pub_key",
                "type": "core::felt252",
                "kind": "data"
            },
            {
                "name": "version",
                "type": "core::felt252",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "Event",
        "kind": "enum",
        "variants": [
            {
                "name": "SettingUpdated",
                "type": "SettingUpdated",
                "kind": "nested"
            },
            {
                "name": "SettingRemoved",
                "type": "SettingRemoved",
                "kind": "nested"
            },
            {
                "name": "WalletKeyUpdated",
                "type": "WalletKeyUpdated",
                "kind": "nested"
            }
        ]
    }
] as const
