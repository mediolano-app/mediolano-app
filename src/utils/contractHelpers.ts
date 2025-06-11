import { Contract, CallData, RpcProvider } from 'starknet';

export class MediolanoContractHelper {
  private contract: Contract;
  private provider: RpcProvider;

  constructor(contract: Contract, provider: RpcProvider) {
    this.contract = contract;
    this.provider = provider;
  }

  async getUserTokens(userAddress: string): Promise<string[]> {
    try {
      const result = await this.contract.call('balance_of', [userAddress]);
      const balance = parseInt(result.toString());
      
      const tokens: string[] = [];
      for (let i = 0; i < balance; i++) {
        try {
          const tokenResult = await this.contract.call('token_of_owner_by_index', [
            userAddress,
            i
          ]);
          tokens.push(tokenResult.toString());
        } catch (error) {
          console.warn(`Failed to get token at index ${i}:`, error);
        }
      }
      
      return tokens;
    } catch (error) {
      console.error('Error fetching user tokens:', error);
      throw error;
    }
  }

  async getTokenMetadata(tokenId: string): Promise<string> {
    try {
      const result = await this.contract.call('token_uri', [tokenId]);
      return result.toString();
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      throw error;
    }
  }

  async getTokenOwner(tokenId: string): Promise<string> {
    try {
      const result = await this.contract.call('owner_of', [tokenId]);
      return result.toString();
    } catch (error) {
      console.error('Error fetching token owner:', error);
      throw error;
    }
  }

  async getTotalSupply(): Promise<number> {
    try {
      const result = await this.contract.call('total_supply', []);
      return parseInt(result.toString());
    } catch (error) {
      console.error('Error fetching total supply:', error);
      throw error;
    }
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    try {
      const result = await this.contract.call('is_approved_for_all', [owner, operator]);
      return Boolean(result);
    } catch (error) {
      console.error('Error checking approval:', error);
      throw error;
    }
  }
}