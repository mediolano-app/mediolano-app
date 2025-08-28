export const userSettingsAbi = [
  {
    "type": "impl",
    "name": "UserPublicProfileImpl",
    "interface_name": "publicprofile::IUserPublicProfile"
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
    "name": "publicprofile::PersonalInfo",
    "members": [
      {
        "name": "username",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "name",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "bio",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "location",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "email",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "phone",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "org",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "website",
        "type": "core::byte_array::ByteArray"
      }
    ]
  },
  {
    "type": "struct",
    "name": "publicprofile::SocialMediaLinks",
    "members": [
      {
        "name": "x_handle",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "linkedin",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "instagram",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "tiktok",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "facebook",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "discord",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "youtube",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "github",
        "type": "core::byte_array::ByteArray"
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
    "name": "publicprofile::ProfileSettings",
    "members": [
      {
        "name": "display_public_profile",
        "type": "core::bool"
      },
      {
        "name": "email_notifications",
        "type": "core::bool"
      },
      {
        "name": "marketplace_profile",
        "type": "core::bool"
      }
    ]
  },
  {
    "type": "struct",
    "name": "publicprofile::UserProfile",
    "members": [
      {
        "name": "username",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "name",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "bio",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "location",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "email",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "phone",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "org",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "website",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "x_handle",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "linkedin",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "instagram",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "tiktok",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "facebook",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "discord",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "youtube",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "github",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "display_public_profile",
        "type": "core::bool"
      },
      {
        "name": "email_notifications",
        "type": "core::bool"
      },
      {
        "name": "marketplace_profile",
        "type": "core::bool"
      },
      {
        "name": "is_registered",
        "type": "core::bool"
      },
      {
        "name": "last_updated",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "type": "interface",
    "name": "publicprofile::IUserPublicProfile",
    "items": [
      {
        "type": "function",
        "name": "register_profile",
        "inputs": [
          {
            "name": "personal_info",
            "type": "publicprofile::PersonalInfo"
          },
          {
            "name": "social_links",
            "type": "publicprofile::SocialMediaLinks"
          },
          {
            "name": "settings",
            "type": "publicprofile::ProfileSettings"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "update_personal_info",
        "inputs": [
          {
            "name": "personal_info",
            "type": "publicprofile::PersonalInfo"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "update_social_links",
        "inputs": [
          {
            "name": "social_links",
            "type": "publicprofile::SocialMediaLinks"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "update_settings",
        "inputs": [
          {
            "name": "settings",
            "type": "publicprofile::ProfileSettings"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_profile",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "publicprofile::UserProfile"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_personal_info",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "publicprofile::PersonalInfo"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_social_links",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "publicprofile::SocialMediaLinks"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_settings",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "publicprofile::ProfileSettings"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "is_profile_registered",
        "inputs": [
          {
            "name": "user",
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
        "name": "get_profile_count",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_username",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
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
        "name": "is_profile_public",
        "inputs": [
          {
            "name": "user",
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
    "type": "event",
    "name": "publicprofile::UserPublicProfile::ProfileRegistered",
    "kind": "struct",
    "members": [
      {
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "username",
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
    "name": "publicprofile::UserPublicProfile::ProfileUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
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
    "name": "publicprofile::UserPublicProfile::SettingsUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
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
    "name": "publicprofile::UserPublicProfile::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "ProfileRegistered",
        "type": "publicprofile::UserPublicProfile::ProfileRegistered",
        "kind": "nested"
      },
      {
        "name": "ProfileUpdated",
        "type": "publicprofile::UserPublicProfile::ProfileUpdated",
        "kind": "nested"
      },
      {
        "name": "SettingsUpdated",
        "type": "publicprofile::UserPublicProfile::SettingsUpdated",
        "kind": "nested"
      }
    ]
  }
]