export const userSettingsAbi = [
  {
    name: "UpgradeableImpl",
    type: "impl",
    interface_name: "openzeppelin_upgrades::interface::IUpgradeable",
  },
  {
    name: "openzeppelin_upgrades::interface::IUpgradeable",
    type: "interface",
    items: [
      {
        name: "upgrade",
        type: "function",
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
    name: "EncryptedPreferencesRegistryImpl",
    type: "impl",
    interface_name:
      "user_settings::interfaces::settings_interfaces::IEncryptedPreferencesRegistry",
  },
  {
    name: "core::option::Option::<core::felt252>",
    type: "enum",
    variants: [
      {
        name: "Some",
        type: "core::felt252",
      },
      {
        name: "None",
        type: "()",
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
    name: "core::option::Option::<core::integer::u8>",
    type: "enum",
    variants: [
      {
        name: "Some",
        type: "core::integer::u8",
      },
      {
        name: "None",
        type: "()",
      },
    ],
  },
  {
    name: "core::option::Option::<core::bool>",
    type: "enum",
    variants: [
      {
        name: "Some",
        type: "core::bool",
      },
      {
        name: "None",
        type: "()",
      },
    ],
  },
  {
    name: "user_settings::structs::settings_structs::AccountSetting",
    type: "struct",
    members: [
      {
        name: "name",
        type: "core::felt252",
      },
      {
        name: "email",
        type: "core::felt252",
      },
      {
        name: "username",
        type: "core::felt252",
      },
    ],
  },
  {
    name: "user_settings::structs::settings_structs::NetworkType",
    type: "enum",
    variants: [
      {
        name: "TESTNET",
        type: "()",
      },
      {
        name: "MAINNET",
        type: "()",
      },
    ],
  },
  {
    name: "user_settings::structs::settings_structs::GasPricePreference",
    type: "enum",
    variants: [
      {
        name: "LOW",
        type: "()",
      },
      {
        name: "MEDIUM",
        type: "()",
      },
      {
        name: "HIGH",
        type: "()",
      },
    ],
  },
  {
    name: "user_settings::structs::settings_structs::NetworkSettings",
    type: "struct",
    members: [
      {
        name: "network_type",
        type: "user_settings::structs::settings_structs::NetworkType",
      },
      {
        name: "gas_price_preference",
        type: "user_settings::structs::settings_structs::GasPricePreference",
      },
    ],
  },
  {
    name: "user_settings::structs::settings_structs::IPProtectionLevel",
    type: "enum",
    variants: [
      {
        name: "STANDARD",
        type: "()",
      },
      {
        name: "ADVANCED",
        type: "()",
      },
    ],
  },
  {
    name: "user_settings::structs::settings_structs::IPSettings",
    type: "struct",
    members: [
      {
        name: "ip_protection_level",
        type: "user_settings::structs::settings_structs::IPProtectionLevel",
      },
      {
        name: "automatic_ip_registration",
        type: "core::bool",
      },
    ],
  },
  {
    name: "user_settings::structs::settings_structs::NotificationSettings",
    type: "struct",
    members: [
      {
        name: "enabled",
        type: "core::bool",
      },
      {
        name: "ip_updates",
        type: "core::bool",
      },
      {
        name: "blockchain_events",
        type: "core::bool",
      },
      {
        name: "account_activity",
        type: "core::bool",
      },
    ],
  },
  {
    name: "user_settings::structs::settings_structs::Security",
    type: "struct",
    members: [
      {
        name: "two_factor_authentication",
        type: "core::bool",
      },
      {
        name: "password",
        type: "core::felt252",
      },
    ],
  },
  {
    name: "user_settings::structs::settings_structs::AdvancedSettings",
    type: "struct",
    members: [
      {
        name: "api_key",
        type: "core::felt252",
      },
      {
        name: "data_retention",
        type: "core::integer::u64",
      },
    ],
  },
  {
    name: "user_settings::structs::settings_structs::XVerification",
    type: "struct",
    members: [
      {
        name: "is_verified",
        type: "core::bool",
      },
      {
        name: "handler",
        type: "core::felt252",
      },
      {
        name: "user_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    name: "user_settings::structs::settings_structs::FacebookVerification",
    type: "struct",
    members: [
      {
        name: "is_verified",
        type: "core::bool",
      },
      {
        name: "handler",
        type: "core::felt252",
      },
      {
        name: "user_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    name: "user_settings::structs::settings_structs::SocialVerification",
    type: "struct",
    members: [
      {
        name: "x_verification_status",
        type: "user_settings::structs::settings_structs::XVerification",
      },
      {
        name: "facebook_verification_status",
        type: "user_settings::structs::settings_structs::FacebookVerification",
      },
    ],
  },
  {
    name: "user_settings::interfaces::settings_interfaces::IEncryptedPreferencesRegistry",
    type: "interface",
    items: [
      {
        name: "store_account_details",
        type: "function",
        inputs: [
          {
            name: "name",
            type: "core::felt252",
          },
          {
            name: "email",
            type: "core::felt252",
          },
          {
            name: "username",
            type: "core::felt252",
          },
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "update_account_details",
        type: "function",
        inputs: [
          {
            name: "name",
            type: "core::option::Option::<core::felt252>",
          },
          {
            name: "email",
            type: "core::option::Option::<core::felt252>",
          },
          {
            name: "username",
            type: "core::option::Option::<core::felt252>",
          },
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "store_ip_management_settings",
        type: "function",
        inputs: [
          {
            name: "protection_level",
            type: "core::integer::u8",
          },
          {
            name: "automatic_ip_registration",
            type: "core::bool",
          },
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "update_ip_management_settings",
        type: "function",
        inputs: [
          {
            name: "protection_level",
            type: "core::option::Option::<core::integer::u8>",
          },
          {
            name: "automatic_ip_registration",
            type: "core::option::Option::<core::bool>",
          },
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "store_notification_settings",
        type: "function",
        inputs: [
          {
            name: "enable_notifications",
            type: "core::bool",
          },
          {
            name: "ip_updates",
            type: "core::bool",
          },
          {
            name: "blockchain_events",
            type: "core::bool",
          },
          {
            name: "account_activity",
            type: "core::bool",
          },
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "update_notification_settings",
        type: "function",
        inputs: [
          {
            name: "enable_notifications",
            type: "core::option::Option::<core::bool>",
          },
          {
            name: "ip_updates",
            type: "core::option::Option::<core::bool>",
          },
          {
            name: "blockchain_events",
            type: "core::option::Option::<core::bool>",
          },
          {
            name: "account_activity",
            type: "core::option::Option::<core::bool>",
          },
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "store_security_settings",
        type: "function",
        inputs: [
          {
            name: "password",
            type: "core::felt252",
          },
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "update_security_settings",
        type: "function",
        inputs: [
          {
            name: "password",
            type: "core::felt252",
          },
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "store_network_settings",
        type: "function",
        inputs: [
          {
            name: "network_type",
            type: "core::integer::u8",
          },
          {
            name: "gas_price_preference",
            type: "core::integer::u8",
          },
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "update_network_settings",
        type: "function",
        inputs: [
          {
            name: "network_type",
            type: "core::option::Option::<core::integer::u8>",
          },
          {
            name: "gas_price_preference",
            type: "core::option::Option::<core::integer::u8>",
          },
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "store_advanced_settings",
        type: "function",
        inputs: [
          {
            name: "api_key",
            type: "core::felt252",
          },
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "store_X_verification",
        type: "function",
        inputs: [
          {
            name: "x_verified",
            type: "core::bool",
          },
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
          {
            name: "handler",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "regenerate_api_key",
        type: "function",
        inputs: [
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
        ],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "delete_account",
        type: "function",
        inputs: [
          {
            name: "timestamp",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "get_account_settings",
        type: "function",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "user_settings::structs::settings_structs::AccountSetting",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_network_settings",
        type: "function",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "user_settings::structs::settings_structs::NetworkSettings",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_ip_settings",
        type: "function",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "user_settings::structs::settings_structs::IPSettings",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_notification_settings",
        type: "function",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "user_settings::structs::settings_structs::NotificationSettings",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_security_settings",
        type: "function",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "user_settings::structs::settings_structs::Security",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_advanced_settings",
        type: "function",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "user_settings::structs::settings_structs::AdvancedSettings",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_social_verification",
        type: "function",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "user_settings::structs::settings_structs::SocialVerification",
          },
        ],
        state_mutability: "view",
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
        name: "mediolano_app",
        type: "core::starknet::contract_address::ContractAddress",
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
    kind: "struct",
    name: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    type: "event",
    members: [
      {
        kind: "data",
        name: "class_hash",
        type: "core::starknet::class_hash::ClassHash",
      },
    ],
  },
  {
    kind: "enum",
    name: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    type: "event",
    variants: [
      {
        kind: "nested",
        name: "Upgraded",
        type: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
      },
    ],
  },
  {
    kind: "struct",
    name: "user_settings::EncryptedPreferencesRegistry::EncryptedPreferencesRegistry::SettingUpdated",
    type: "event",
    members: [
      {
        kind: "key",
        name: "user",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "setting_type",
        type: "core::felt252",
      },
      {
        kind: "data",
        name: "timestamp",
        type: "core::integer::u64",
      },
    ],
  },
  {
    kind: "struct",
    name: "user_settings::EncryptedPreferencesRegistry::EncryptedPreferencesRegistry::SettingRemoved",
    type: "event",
    members: [
      {
        kind: "key",
        name: "user",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "setting_type",
        type: "core::felt252",
      },
      {
        kind: "data",
        name: "timestamp",
        type: "core::integer::u64",
      },
    ],
  },
  {
    kind: "struct",
    name: "user_settings::EncryptedPreferencesRegistry::EncryptedPreferencesRegistry::WalletKeyUpdated",
    type: "event",
    members: [
      {
        kind: "key",
        name: "user",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "pub_key",
        type: "core::felt252",
      },
      {
        kind: "data",
        name: "version",
        type: "core::felt252",
      },
      {
        kind: "data",
        name: "timestamp",
        type: "core::integer::u64",
      },
    ],
  },
  {
    kind: "struct",
    name: "user_settings::EncryptedPreferencesRegistry::EncryptedPreferencesRegistry::SocialVerificationUpdated",
    type: "event",
    members: [
      {
        kind: "key",
        name: "user",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "x_verified",
        type: "core::bool",
      },
      {
        kind: "data",
        name: "timestamp",
        type: "core::integer::u64",
      },
    ],
  },
  {
    kind: "struct",
    name: "user_settings::EncryptedPreferencesRegistry::EncryptedPreferencesRegistry::AccountDeleted",
    type: "event",
    members: [
      {
        kind: "key",
        name: "user",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "setting",
        type: "core::felt252",
      },
      {
        kind: "data",
        name: "timestamp",
        type: "core::integer::u64",
      },
    ],
  },
  {
    kind: "enum",
    name: "user_settings::EncryptedPreferencesRegistry::EncryptedPreferencesRegistry::Event",
    type: "event",
    variants: [
      {
        kind: "flat",
        name: "OwnableEvent",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
      },
      {
        kind: "flat",
        name: "UpgradeableEvent",
        type: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
      },
      {
        kind: "nested",
        name: "SettingUpdated",
        type: "user_settings::EncryptedPreferencesRegistry::EncryptedPreferencesRegistry::SettingUpdated",
      },
      {
        kind: "nested",
        name: "SettingRemoved",
        type: "user_settings::EncryptedPreferencesRegistry::EncryptedPreferencesRegistry::SettingRemoved",
      },
      {
        kind: "nested",
        name: "WalletKeyUpdated",
        type: "user_settings::EncryptedPreferencesRegistry::EncryptedPreferencesRegistry::WalletKeyUpdated",
      },
      {
        kind: "nested",
        name: "SocialVerificationUpdated",
        type: "user_settings::EncryptedPreferencesRegistry::EncryptedPreferencesRegistry::SocialVerificationUpdated",
      },
      {
        kind: "nested",
        name: "AccountDeleted",
        type: "user_settings::EncryptedPreferencesRegistry::EncryptedPreferencesRegistry::AccountDeleted",
      },
    ],
  },
];
