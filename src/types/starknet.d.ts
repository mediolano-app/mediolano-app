declare module 'starknet' {
	export interface Abi {
		[key: string]: unknown;
	}

	export class Contract {
		constructor(abi: Abi, address: string, provider: unknown);
		call(method: string, params?: unknown[]): Promise<unknown>;
	}

	export const num: {
		toBigInt(value: unknown): bigint;
		toHex(value: unknown): string;
	};
}
