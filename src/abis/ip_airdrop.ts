export interface NFTAirdrop {
    constructor(
      owner: string,
      name: string,
      symbol: string,
      baseUri: string,
      merkleRoot: string
    ): void;
  
    whitelist(to: string, amount: number): void;
  
    whitelistBalanceOf(to: string): Promise<number>;
  
    airdrop(): void;
  
    claimWithProof(proof: string[], amount: number): void;
  }
  
  export interface Event {
    ERC721Event?: any; // Replace with a specific type if needed
    OwnableEvent?: any; // Replace with a specific type if needed
    SRC5Event?: any; // Replace with a specific type if needed
  }
  
  export interface Storage {
    erc721: any; // ERC721 Storage Component
    ownable: any; // Ownable Storage Component
    src5: any; // SRC5 Storage Component
    whitelists: [string, number][]; // Address and amount
    merkleRoot: string; // Merkle root
    nextTokenId: bigint; // Next token ID
  }
  