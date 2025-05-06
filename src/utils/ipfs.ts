// utils/ipfs.ts

export interface IPFSMetadata {
  name?: string;
  description?: string;
  image?: string;
  type?: string;
  creator?: string | { name: string; address: string };
  attributes?: Array<{ trait_type: string; value: string }>;
  registrationDate?: string; 
  [key: string]: any; 
}

export interface AssetType {
  id: string;
  name: string;
  description?: string;
  image?: string;
  ipfsCid?: string;
  type?: string;
  creator: any; 
  owner: any; 
  registrationDate?: string; 
  attributes?: Array<{ trait_type: string; value: string }>;
  [key: string]: any; 
}

export interface EnhancedAsset extends AssetType {
  ipfsCid?: string;
}

const CACHE_EXPIRY = 24 * 60 * 60 * 1000;
const CACHE_PREFIX = 'ipfs-metadata-';

const IPFS_GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/'
];

/**
 * Retrieve metadata from IPFS using public a gateaway with cache 
 * @param {string} cid 
 * @param {boolean} bypassCache 
 * @returns {Promise<IPFSMetadata|null>} 
 */
export async function fetchIPFSMetadata(cid: string, bypassCache = false): Promise<IPFSMetadata | null> {
  if (!cid) return null;
  
  if (!bypassCache) {
    const cachedData = localStorage.getItem(`${CACHE_PREFIX}${cid}`);
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          console.log(`Using cached IPFS metadata for ${cid}`);
          return data as IPFSMetadata;
        } else {
          console.log(`Cache expired for ${cid}, fetching fresh data`);
        }
      } catch (e) {
        console.warn(`Failed to parse cached metadata for ${cid}:`, e);
      }
    }
  }
  
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); 
      
      const response = await fetch(`${gateway}${cid}`, { 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`Gateway ${gateway} returned ${response.status} for ${cid}`);
        continue; 
      }
      
      const metadata = await response.json();
      
      const cacheEntry = {
        data: metadata,
        timestamp: Date.now()
      };
      
      localStorage.setItem(`${CACHE_PREFIX}${cid}`, JSON.stringify(cacheEntry));
      console.log(`Successfully fetched and cached metadata for ${cid} using ${gateway}`);
      
      return metadata as IPFSMetadata;
    } catch (error) {
      console.warn(`Error fetching from ${gateway}${cid}:`, error);
    }
  }
  
  console.error(`All IPFS gateways failed for ${cid}`);
  return null;
}

/**
 * Recognize the IP type by metadata
 * @param {IPFSMetadata} metadata 
 * @returns {string} 
 */
export function determineIPType(metadata: IPFSMetadata | null): string {
  if (!metadata) return 'Generic';
  
  if (metadata.type) {
    return metadata.type;
  }
  
  if (metadata.medium === 'Digital Art' || metadata.medium === 'Physical Art' || 
      metadata.medium === 'Painting' || metadata.medium === 'Illustration') {
    return 'Art';
  }
  
  if (metadata.fileType) {
    if (metadata.fileType.startsWith('audio/')) return 'Audio';
    if (metadata.fileType.startsWith('video/')) return 'Video';
    if (metadata.fileType.includes('code') || metadata.fileType.includes('javascript')) return 'Software';
  }
  
  if (metadata.duration || metadata.genre || metadata.bpm) return 'Audio';
  if (metadata.resolution || metadata.framerate) return 'Video';
  if (metadata.yearCreated && metadata.artistName) return 'Art';
  if (metadata.version && (metadata.external_url || metadata.repository)) return 'Software';
  if (metadata.patent_number || metadata.patent_date) return 'Patent';
  if (metadata.trademark_number) return 'Trademark';
  
  if (metadata.tokenId || metadata.tokenStandard || metadata.blockchain) return 'NFT';
  
  if (metadata.pages || metadata.authors || metadata.publisher) return 'Document';
  
  return 'Generic';
}

/**
 * Stract the known CDIs
 * @returns {Record<string, string>} 
 */
export function getKnownCids(): Record<string, string> {
  const cachedCids = localStorage.getItem('known-ipfs-cids');
  if (cachedCids) {
    try {
      return JSON.parse(cachedCids);
    } catch (e) {
      console.warn('Failed to parse cached CIDs, regenerating');
    }
  }
  

  const cids = {
    "1": "QmT7fTAgtScnXy1WGHYfzWrZfTsZEWPXbZqRPKqsYbifF1", // Arte digital
    "2": "QmULxVeZ6ADXYfSmvbWAr3k6WVp7WFjEbxxUdqkzKwxriY", // Software 
    "3": "QmVLDAhCY3X9P2uRudKAryuQFPM5zqA3Yij1dY8FpGbL3T", // Audio
    "4": "QmP1QyqoYxmYJQfYDj6BcUa5YNbgWgSJNjGTpz1G8HbR1N", // Video
    "5": "QmWnSQ3oRrYa9GyYaUCKQ5amL1z2Q1LFMYVM8Rkd3r9Kj2", // Patent
    // Add more if is necessary 
  };
  
  localStorage.setItem('known-ipfs-cids', JSON.stringify(cids));
  
  return cids;
}

/**
 * Mix the mockdata with ipfsdata if is necessary
 * @param {IPFSMetadata} ipfsData 
 * @param {AssetType} mockData
 * @returns {AssetType}
 */
export function combineData(ipfsData: IPFSMetadata | null, mockData: AssetType): AssetType {
  if (!ipfsData) return mockData;
  
  // Combinar los datos, priorizando los datos de IPFS
  const result: AssetType = {
    ...mockData,
    ...ipfsData as any, 
    id: mockData.id, 
    creator: ipfsData.creator || mockData.creator,
    owner: mockData.owner, // Mantener el owner actual
    image: ipfsData.image || mockData.image,
    attributes: ipfsData.attributes || mockData.attributes,
    type: determineIPType(ipfsData),
    registrationDate: ipfsData.registrationDate || mockData.registrationDate
  };
  
  if (mockData.ipfsCid) {
    result.ipfsCid = mockData.ipfsCid;
  }
  
  return result;
}

/**
 * Load the IPFS metatada to multiple assets in the background
 * @param {AssetType[]} assets 
 * @param {Function} updateCallback 
 * @param {number} batchSize 
 */
export async function loadIPFSMetadataInBackground(
  assets: AssetType[],
  updateCallback: (updatedAssets: EnhancedAsset[]) => void,
  batchSize = 3
): Promise<void> {
  const assetsWithCids = assets.filter(asset => asset.ipfsCid);
  if (assetsWithCids.length === 0) return;
  
  const batches = [];
  for (let i = 0; i < assetsWithCids.length; i += batchSize) {
    batches.push(assetsWithCids.slice(i, i + batchSize));
  }
  
  let updatedAssets: EnhancedAsset[] = [...assets] as EnhancedAsset[];
  
  for (const batch of batches) {
    const processedBatch = await Promise.all(
      batch.map(async (asset) => {
        try {
          const metadata = await fetchIPFSMetadata(asset.ipfsCid!);
          return combineData(metadata, asset) as EnhancedAsset;
        } catch (error) {
          console.error(`Failed to load metadata for asset ${asset.id}:`, error);
          return asset as EnhancedAsset; 
        }
      })
    );
    
    updatedAssets = updatedAssets.map(asset => {
      const processed = processedBatch.find(a => a.id === asset.id);
      return processed || asset;
    });
    
    updateCallback(updatedAssets);
    
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

/**
 * Clean cache of IPFS metadata
 * @param {string} cid 
 */
export function clearIPFSCache(cid?: string): void {
  if (cid) {
    localStorage.removeItem(`${CACHE_PREFIX}${cid}`);
    console.log(`Cleared cache for ${cid}`);
  } else {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    console.log('Cleared all IPFS metadata cache');
  }
}