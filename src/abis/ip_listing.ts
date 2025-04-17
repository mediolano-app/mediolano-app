export const IPListingABI = [
  {
    name: "IMIPListingImpl",
    type: "impl",
    interface_name: "contracts::interfaces::IMIPListing",
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
    name: "contracts::interfaces::IMIPListing",
    type: "interface",
    items: [
      {
        name: "create_listing",
        type: "function",
        inputs: [
          {
            name: "assetContractAddress",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "tokenId",
            type: "core::integer::u256",
          },
          {
            name: "startTime",
            type: "core::integer::u256",
          },
          {
            name: "secondsUntilEndTime",
            type: "core::integer::u256",
          },
          {
            name: "quantityToList",
            type: "core::integer::u256",
          },
          {
            name: "currencyToAccept",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "buyoutPricePerToken",
            type: "core::integer::u256",
          },
          {
            name: "tokenTypeOfListing",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "update_ip_marketplace_address",
        type: "function",
        inputs: [
          {
            name: "new_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    name: "OwnableMixinImpl",
    type: "impl",
    interface_name: "openzeppelin_access::ownable::interface::OwnableABI",
  },
  {
    name: "openzeppelin_access::ownable::interface::OwnableABI",
    type: "interface",
    items: [
      {
        name: "owner",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "transfer_ownership",
        type: "function",
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
        name: "renounce_ownership",
        type: "function",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "transferOwnership",
        type: "function",
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
        name: "renounceOwnership",
        type: "function",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    name: "constructor",
    type: "constructor",
    inputs: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "ip_marketplace",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "struct",
    name: "contracts::MIPlisting::MIPListing::ListingCreated",
    type: "event",
    members: [
      {
        kind: "key",
        name: "token_id",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "lister",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "date",
        type: "core::integer::u64",
      },
    ],
  },
  {
    kind: "struct",
    name: "contracts::MIPlisting::MIPListing::IPMarketplaceUpdated",
    type: "event",
    members: [
      {
        kind: "key",
        name: "address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "date",
        type: "core::integer::u64",
      },
    ],
  },
  {
    kind: "struct",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    type: "event",
    members: [
      {
        kind: "key",
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "key",
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "struct",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    type: "event",
    members: [
      {
        kind: "key",
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "key",
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "enum",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    type: "event",
    variants: [
      {
        kind: "nested",
        name: "OwnershipTransferred",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
      },
      {
        kind: "nested",
        name: "OwnershipTransferStarted",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
      },
    ],
  },
  {
    kind: "enum",
    name: "contracts::MIPlisting::MIPListing::Event",
    type: "event",
    variants: [
      {
        kind: "nested",
        name: "ListingCreated",
        type: "contracts::MIPlisting::MIPListing::ListingCreated",
      },
      {
        kind: "nested",
        name: "IPMarketplaceUpdated",
        type: "contracts::MIPlisting::MIPListing::IPMarketplaceUpdated",
      },
      {
        kind: "flat",
        name: "OwnableEvent",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
      },
    ],
  },
] as const;
