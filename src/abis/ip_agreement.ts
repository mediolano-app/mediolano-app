export const ip_agreement_abi = [
    {
      "name": "IPLicensingAgreementImpl",
      "type": "impl",
      "interface_name": "ip_license_agreement::interfaces::IIPLicensingAgreement::IIPLicensingAgreement"
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
      "name": "ip_license_agreement::interfaces::IIPLicensingAgreement::IIPLicensingAgreement",
      "type": "interface",
      "items": [
        {
          "name": "sign_agreement",
          "type": "function",
          "inputs": [],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "make_immutable",
          "type": "function",
          "inputs": [],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "add_metadata",
          "type": "function",
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
          "name": "get_metadata",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "(core::byte_array::ByteArray, core::byte_array::ByteArray, core::byte_array::ByteArray, core::integer::u64, core::bool, core::integer::u64)"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_additional_metadata",
          "type": "function",
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
          "name": "is_signer",
          "type": "function",
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
          "name": "has_signed",
          "type": "function",
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
          "name": "get_signature_timestamp",
          "type": "function",
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
          "name": "get_signers",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_signer_count",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_signature_count",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "is_fully_signed",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_factory",
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
          "name": "get_owner",
          "type": "function",
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
      "name": "constructor",
      "type": "constructor",
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
      "name": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::AgreementSigned",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "signer",
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
      "name": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::AgreementMadeImmutable",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "timestamp",
          "type": "core::integer::u64"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::MetadataAdded",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "key",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "value",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "enum",
      "name": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::Event",
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
          "kind": "nested",
          "name": "AgreementSigned",
          "type": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::AgreementSigned"
        },
        {
          "kind": "nested",
          "name": "AgreementMadeImmutable",
          "type": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::AgreementMadeImmutable"
        },
        {
          "kind": "nested",
          "name": "MetadataAdded",
          "type": "ip_license_agreement::IPLicensingAgreement::IPLicensingAgreement::MetadataAdded"
        }
      ]
    }
  ]