export const ip_licensing_agreement = [
    {
      "type": "impl",
      "name": "IPLicensingAgreementImpl",
      "interface_name": "ip_license_agreement::interfaces::IIPLicensingAgreement::IIPLicensingAgreement"
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
      "name": "ip_license_agreement::interfaces::IIPLicensingAgreement::IIPLicensingAgreement",
      "items": [
        {
          "type": "function",
          "name": "sign_agreement",
          "inputs": [],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "make_immutable",
          "inputs": [],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "add_metadata",
          "inputs": [
            {
              "name": "key",
              "type": "core::felt252"
            },
            {
              "name": "value",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_metadata",
          "inputs": [],
          "outputs": [
            {
              "type": "(core::byte_array::ByteArray, core::byte_array::ByteArray, core::byte_array::ByteArray, core::integer::u64, core::bool, core::integer::u64)"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_additional_metadata",
          "inputs": [
            {
              "name": "key",
              "type": "core::felt252"
            }
          ],
          "outputs": [
            {
              "type": "core::felt252"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "is_signer",
          "inputs": [
            {
              "name": "address",
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
          "name": "has_signed",
          "inputs": [
            {
              "name": "address",
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
          "name": "get_signature_timestamp",
          "inputs": [
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress"
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
          "name": "get_signers",
          "inputs": [],
          "outputs": [
            {
              "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_signer_count",
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
          "name": "get_signature_count",
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
          "name": "is_fully_signed",
          "inputs": [],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_factory",
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
          "name": "get_owner",
          "inputs": [],
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
          "name": "creator",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "factory",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "title",
          "type": "core::byte_array::ByteArray"
        },
        {
          "name": "description",
          "type": "core::byte_array::ByteArray"
        },
        {
          "name": "ip_metadata",
          "type": "core::byte_array::ByteArray"
        },
        {
          "name": "signers",
          "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
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
      "name": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::AgreementSigned",
      "kind": "struct",
      "members": [
        {
          "name": "signer",
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
      "name": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::AgreementMadeImmutable",
      "kind": "struct",
      "members": [
        {
          "name": "timestamp",
          "type": "core::integer::u64",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::MetadataAdded",
      "kind": "struct",
      "members": [
        {
          "name": "key",
          "type": "core::felt252",
          "kind": "data"
        },
        {
          "name": "value",
          "type": "core::felt252",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::Event",
      "kind": "enum",
      "variants": [
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
          "name": "AgreementSigned",
          "type": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::AgreementSigned",
          "kind": "nested"
        },
        {
          "name": "AgreementMadeImmutable",
          "type": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::AgreementMadeImmutable",
          "kind": "nested"
        },
        {
          "name": "MetadataAdded",
          "type": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::MetadataAdded",
          "kind": "nested"
        }
      ]
    }
  ]