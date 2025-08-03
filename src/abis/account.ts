
export const accountABI = [
    {
      "name": "UserPublicProfileImpl",
      "type": "impl",
      "interface_name": "publicprofile::IUserPublicProfile"
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
      "name": "publicprofile::PersonalInfo",
      "type": "struct",
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
      "name": "publicprofile::SocialMediaLinks",
      "type": "struct",
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
      "name": "publicprofile::ProfileSettings",
      "type": "struct",
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
      "name": "publicprofile::UserProfile",
      "type": "struct",
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
      "name": "publicprofile::IUserPublicProfile",
      "type": "interface",
      "items": [
        {
          "name": "register_profile",
          "type": "function",
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
          "name": "update_personal_info",
          "type": "function",
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
          "name": "update_social_links",
          "type": "function",
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
          "name": "update_settings",
          "type": "function",
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
          "name": "get_profile",
          "type": "function",
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
          "name": "get_personal_info",
          "type": "function",
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
          "name": "get_social_links",
          "type": "function",
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
          "name": "get_settings",
          "type": "function",
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
          "name": "is_profile_registered",
          "type": "function",
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
          "name": "get_profile_count",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::integer::u32"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_username",
          "type": "function",
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
          "name": "is_profile_public",
          "type": "function",
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
      "kind": "struct",
      "name": "publicprofile::UserPublicProfile::ProfileRegistered",
      "type": "event",
      "members": [
        {
          "kind": "key",
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "username",
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
      "name": "publicprofile::UserPublicProfile::ProfileUpdated",
      "type": "event",
      "members": [
        {
          "kind": "key",
          "name": "user",
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
      "name": "publicprofile::UserPublicProfile::SettingsUpdated",
      "type": "event",
      "members": [
        {
          "kind": "key",
          "name": "user",
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
      "name": "publicprofile::UserPublicProfile::Event",
      "type": "event",
      "variants": [
        {
          "kind": "nested",
          "name": "ProfileRegistered",
          "type": "publicprofile::UserPublicProfile::ProfileRegistered"
        },
        {
          "kind": "nested",
          "name": "ProfileUpdated",
          "type": "publicprofile::UserPublicProfile::ProfileUpdated"
        },
        {
          "kind": "nested",
          "name": "SettingsUpdated",
          "type": "publicprofile::UserPublicProfile::SettingsUpdated"
        }
      ]
    }
  ] as const