// utils/ipfs.ts

export interface IPFSMetadata {
  name?: string;
  description?: string;
  image?: string;
  type?: string;
  creator?: string | { name: string; address: string };
  attributes?: Array<{ trait_type: string; value: string }>;
  properties?: Record<string, unknown>;
  registrationDate?: string;
  medium?: string;
  fileType?: string;
  duration?: number;
  genre?: string;
  bpm?: number;
  resolution?: string;
  framerate?: number;
  yearCreated?: number;
  artistName?: string;
  version?: string;
  external_url?: string;
  repository?: string;
  patent_number?: string;
  patent_date?: string;
  trademark_number?: string;
  tokenId?: string;
  tokenStandard?: string;
  blockchain?: string;
  pages?: number;
  authors?: string[];
  publisher?: string;
  [key: string]: unknown;
}

export interface AssetType {
  id: string;
  name: string;
  description?: string;
  image?: string;
  ipfsCid?: string;
  metadataUrl?: string;
  type?: string;
  creator: string | { name: string; address: string };
  owner: string | { name: string; address: string };
  registrationDate?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  [key: string]: unknown;
}

export interface EnhancedAsset extends AssetType {
  ipfsCid?: string;
}

const CACHE_EXPIRY = 24 * 60 * 60 * 1000;
const CACHE_PREFIX = 'ipfs-metadata-';

export const IPFS_GATEWAYS = [
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
          return data as IPFSMetadata;
        } else {
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


      return metadata as IPFSMetadata;
    } catch (error) {
      console.warn(`Error fetching from ${gateway}${cid}:`, error);
    }
  }

  console.error(`All IPFS gateways failed for ${cid}`);
  return null;
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
    } catch {
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
    ...(ipfsData as Partial<AssetType>),
    id: mockData.id,
    creator: ipfsData.creator || mockData.creator,
    owner: mockData.owner, // Mantener el owner actual
    image: ipfsData.image || mockData.image,
    attributes: ipfsData.attributes || mockData.attributes,
    type: ipfsData.type || mockData.type,
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


/**
 * Process IPFS hash to URL
 * Converts various IPFS input formats to proper gateway URLs
 * @param {string} input - The IPFS input (CID, undefined/CID, ipfs:/, ipfs://, ipfs:ipfs/, or gateway URL)
 * @param {string} fallbackUrl - Fallback URL if processing fails
 * @returns {string} Processed URL or fallback
 */
export function processIPFSHashToUrl(input: string, fallbackUrl: string): string {
  if (typeof input !== "string") return fallbackUrl;

  let processedUrl = input.replace(/\0/g, "").trim();

  // Handle undefined prefix
  if (processedUrl.startsWith("undefined/")) {
    const cid = processedUrl.replace("undefined/", "");
    if (cid.match(/^[a-zA-Z0-9]+$/) && cid.length >= 34) {
      return `${IPFS_GATEWAYS[0]}${cid}`;
    } else {
      return fallbackUrl;
    }
  }

  // Reject inputs too short to be valid CIDs
  if (
    processedUrl.length < 34 &&
    !processedUrl.startsWith("http") &&
    !processedUrl.startsWith("/")
  ) {
    console.log(
      `Input too short to be valid IPFS CID (${processedUrl.length} chars):`,
      processedUrl
    );
    return fallbackUrl;
  }

  // Raw CID
  if (processedUrl.match(/^[a-zA-Z0-9]+$/) && processedUrl.length >= 34) {
    return `${IPFS_GATEWAYS[0]}${processedUrl}`;
  }

  // Existing gateway URLs
  if (IPFS_GATEWAYS.some((gateway) => processedUrl.startsWith(gateway))) {
    return processedUrl;
  }

  // ipfs:/CID, ipfs://CID, ipfs:ipfs/CID
  if (processedUrl.startsWith("ipfs:")) {
    const cid = processedUrl.replace(/^ipfs:(?:ipfs)?\/+/, "");
    return `${IPFS_GATEWAYS[1]}${cid}`;
  }


  // Already a normal http(s) URL (non-gateway or direct IPFS path)
  if (processedUrl.startsWith("http")) {
    const cidMatch = processedUrl.match(/\/ipfs\/([a-zA-Z0-9]+)/);
    if (cidMatch && cidMatch[1].length < 34) {
      console.log(
        `Invalid IPFS gateway URL - CID too short (${cidMatch[1].length} chars):`,
        processedUrl
      );
      return fallbackUrl;
    }
    return processedUrl;
  }


  return fallbackUrl || "";
}
