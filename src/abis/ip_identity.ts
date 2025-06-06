// ABI for the IPIdentity contract (simplified for integration)
export const ipIdentityAbi = [
  {
    "type": "function",
    "name": "register_ip_id",
    "inputs": [
      { "name": "ip_id", "type": "felt252" },
      { "name": "metadata_uri", "type": "felt252[]" },
      { "name": "ip_type", "type": "felt252[]" },
      { "name": "license_terms", "type": "felt252[]" }
    ],
    "outputs": [
      { "name": "token_id", "type": "u256" }
    ]
  },
  {
    "type": "function",
    "name": "update_ip_id_metadata",
    "inputs": [
      { "name": "ip_id", "type": "felt252" },
      { "name": "new_metadata_uri", "type": "felt252[]" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "get_ip_id_data",
    "inputs": [
      { "name": "ip_id", "type": "felt252" }
    ],
    "outputs": [
      { "name": "metadata_uri", "type": "felt252[]" },
      { "name": "ip_type", "type": "felt252[]" },
      { "name": "license_terms", "type": "felt252[]" },
      { "name": "is_verified", "type": "bool" },
      { "name": "created_at", "type": "u64" },
      { "name": "updated_at", "type": "u64" }
    ]
  },
  {
    "type": "function",
    "name": "verify_ip_id",
    "inputs": [
      { "name": "ip_id", "type": "felt252" }
    ],
    "outputs": []
  }
];
