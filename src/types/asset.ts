export interface Asset {
  id: string;
  name: string;
  imageUrl: string;
  isVisible: boolean;
  category?: string;
  collection?: string;
  tokenId?: string;
  openseaUrl?: string;
}


export interface IP {
  id: string;
  name: string;
  image: string;
  isVisible: boolean;
  category?: string;
  collection?: string;
  tokenId?: string;
  type?: string;
}