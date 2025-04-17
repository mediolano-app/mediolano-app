export type IPUsageRights = {
  commercial_use: boolean;
  modifications_allowed: boolean;
  attribution_required: boolean;
  geographic_restrictions: string;
  usage_duration: number;
  sublicensing_allowed: boolean;
  industry_restrictions: string;
};

export type DerivativeRights = {
  allowed: boolean;
  royalty_share: number;
  requires_approval: boolean;
  max_derivatives: number;
};

export type Listing = {
  assetContract: string;
  tokenId: string;
  startTime: string;
  secondsUntilEndTime: string;
  quantityToList: string;
  currencyToAccept: string;
  buyoutPricePerToken: string;
  tokenTypeOfListing: string;
  endTime: string;
};