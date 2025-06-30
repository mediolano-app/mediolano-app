import { SetStateAction } from "react";

export interface AssetMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface LicensingAgreement {
  id: string;
  licensee: string;
  licenseType: "commercial" | "non-commercial" | "exclusive" | "royalty-free";
  startDate: string;
  endDate?: string;
  royaltyPercentage?: number;
  terms: string;
  status: "active" | "expired" | "terminated";
}

export interface AssetEvent {
  id: string;
  type: "creation" | "transfer" | "sale" | "licensing" | "royalty";
  timestamp: string;
  from?: string;
  to?: string;
  price?: string;
  currency?: string;
  transactionHash: string;
  blockNumber: number;
  details?: string;
  licensingAgreement?: LicensingAgreement;
}

export interface ERC721Asset {
  tokenId: string;
  contractAddress: string;
  name: string;
  description: string;
  image: string;
  creator: string;
  currentOwner: string;
  metadata: AssetMetadata;
  createdAt: string;
  lastUpdated: string;
  totalSales: number;
  totalRoyalties: string;
  events: AssetEvent[];
  licensingAgreements: LicensingAgreement[];
  isActive: boolean;
}

export interface CreatorPortfolio {
  creatorAddress: string;
  totalAssets: number;
  totalSales: string;
  totalRoyalties: string;
  assets: ERC721Asset[];
}

export interface NFTCardProps {
  isFiltered: boolean;
  tokenId?: BigInt;
  status: string;
  metadata: IP | null;
  setMetadata: React.Dispatch<SetStateAction<any>>;
  filteredMetadata?: unknown;
  setFilteredMetadata?: React.Dispatch<SetStateAction<any>>;
}

export interface Attribute {
  trait_type?: string;
  value: string;
}

export type IPType = "" | "patent" | "trademark" | "copyright" | "trade_secret";

export interface IP {
  name: string;
  description: string;
  external_url: string;
  image: string;
  attributes: Attribute[];
}
