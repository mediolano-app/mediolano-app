export const ip_revenue_abi = [
    {
      "type": "impl",
      "name": "IIPRevenueSharing",
      "interface_name": "ip_revenue_sharing::IPRevenueSharing::IIPRevenueSharing"
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
      "type": "interface",
      "name": "ip_revenue_sharing::IPRevenueSharing::IIPRevenueSharing",
      "items": [
        {
          "type": "function",
          "name": "create_ip_asset",
          "inputs": [
            {
              "name": "nft_contract",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            },
            {
              "name": "metadata_hash",
              "type": "core::felt252"
            },
            {
              "name": "license_terms_hash",
              "type": "core::felt252"
            },
            {
              "name": "total_shares",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "list_ip_asset",
          "inputs": [
            {
              "name": "nft_contract",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            },
            {
              "name": "price",
              "type": "core::integer::u256"
            },
            {
              "name": "currency_address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "remove_listing",
          "inputs": [
            {
              "name": "nft_contract",
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
          "name": "claim_royalty",
          "inputs": [
            {
              "name": "nft_contract",
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
          "name": "record_sale_revenue",
          "inputs": [
            {
              "name": "nft_contract",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            },
            {
              "name": "amount",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_contract_balance",
          "inputs": [
            {
              "name": "contract",
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
          "name": "add_fractional_owner",
          "inputs": [
            {
              "name": "nft_contract",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            },
            {
              "name": "owner",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "update_fractional_shares",
          "inputs": [
            {
              "name": "nft_contract",
              "type": "core::starknet::contract_address::ContractAddress"
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
              "name": "new_shares",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_fractional_owner",
          "inputs": [
            {
              "name": "nft_contract",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            },
            {
              "name": "index",
              "type": "core::integer::u32"
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
          "name": "get_fractional_owner_count",
          "inputs": [
            {
              "name": "nft_contract",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u32"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_fractional_shares",
          "inputs": [
            {
              "name": "nft_contract",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            },
            {
              "name": "owner",
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
          "name": "get_claimed_revenue",
          "inputs": [
            {
              "name": "nft_contract",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            },
            {
              "name": "owner",
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
          "name": "get_user_ip_asset",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "index",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "(core::starknet::contract_address::ContractAddress, core::integer::u256)"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_user_ip_asset_count",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
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
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "type": "event",
      "name": "ip_revenue_sharing::IPRevenueSharing::IPRevenueSharing::RoyaltyClaimed",
      "kind": "struct",
      "members": [
        {
          "name": "token_id",
          "type": "core::integer::u256",
          "kind": "key"
        },
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "amount",
          "type": "core::integer::u256",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "ip_revenue_sharing::IPRevenueSharing::IPRevenueSharing::RevenueRecorded",
      "kind": "struct",
      "members": [
        {
          "name": "token_id",
          "type": "core::integer::u256",
          "kind": "key"
        },
        {
          "name": "amount",
          "type": "core::integer::u256",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "ip_revenue_sharing::IPRevenueSharing::IPRevenueSharing::IPAssetCreated",
      "kind": "struct",
      "members": [
        {
          "name": "nft_contract",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "token_id",
          "type": "core::integer::u256",
          "kind": "key"
        },
        {
          "name": "creator",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "ip_revenue_sharing::IPRevenueSharing::IPRevenueSharing::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "RoyaltyClaimed",
          "type": "ip_revenue_sharing::IPRevenueSharing::IPRevenueSharing::RoyaltyClaimed",
          "kind": "nested"
        },
        {
          "name": "RevenueRecorded",
          "type": "ip_revenue_sharing::IPRevenueSharing::IPRevenueSharing::RevenueRecorded",
          "kind": "nested"
        },
        {
          "name": "IPAssetCreated",
          "type": "ip_revenue_sharing::IPRevenueSharing::IPRevenueSharing::IPAssetCreated",
          "kind": "nested"
        }
      ]
    }
  ]