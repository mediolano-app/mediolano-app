// TODO: Replace with actual MIP Collections Protocol ABI
// Get this from the deployed contract or contract documentation

export const MIP_COLLECTIONS_ABI = [
    // Example ABI - replace with actual contract ABI
    {
        "name": "get_total_assets",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "total",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "get_assets_paginated",
        "type": "function",
        "inputs": [
            {
                "name": "offset",
                "type": "Uint256"
            },
            {
                "name": "limit",
                "type": "Uint256"
            }
        ],
        "outputs": [
            {
                "name": "assets",
                "type": "Asset*"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "token_uri",
        "type": "function",
        "inputs": [
            {
                "name": "token_id",
                "type": "Uint256"
            }
        ],
        "outputs": [
            {
                "name": "uri",
                "type": "felt*"
            }
        ],
        "stateMutability": "view"
    }
    // Add more functions as needed based on actual contract
];