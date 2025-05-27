/**
 * Application-wide constants
 */

// Contract addresses
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`;
export const IP_REVENUE_CONTRACT_ADDRESS="0x055f444b1ace8bec6d79ceb815a8733958e9ceaa598160af291a7429e0146a74";
export const paymasterParams = !process.env.NEXT_PUBLIC_AVNU_PAYMASTER_API_KEY ? undefined : {
	apiKey: process.env.NEXT_PUBLIC_AVNU_PAYMASTER_API_KEY,
}