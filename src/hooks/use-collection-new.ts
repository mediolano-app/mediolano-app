import { Collection, Asset } from "@/types/asset";
import { RpcProvider, Contract } from "starknet";

async function getContract(provider: RpcProvider, contractAddress: string) {
  if (!contractAddress) {
    throw new Error("Contract address is undefined.");
  }
  // If stable, this would not be needed as ABI would be in code.
  const { abi } = await provider.getClassAt(contractAddress);
  if (!abi) {
    throw new Error(`ABI for address ${contractAddress} is undefined.`);
  }
  // `abi` here would be replaced by the imported ABI.
  return new Contract(abi, contractAddress, provider);
}

function resolveIpfsUrl(url: string): string {
  if (!url) {
    return "/placeholder.svg";
  }
  return url.replace("ipfs://", "https://ipfs.io/ipfs/");
}

export async function getCollectionMetadata(
  collectionAddress: string,
): Promise<Collection> {
  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_RPC_URL!,
  });
  const MIPAddress = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS!;

  try {
    const [collectionContract, MIPContract] = await Promise.all([
      getContract(provider, collectionAddress),
      getContract(provider, MIPAddress),
    ]);

    const [collectionId, totalSupply] = await Promise.all([
      collectionContract.get_collection_id(),
      collectionContract.total_supply(),
    ]);
    const mipCollection = await MIPContract.get_collection(collectionId);

    const resolvedCollectionId = collectionId.toString();
    const resolvedOwner =
      mipCollection.owner &&
      mipCollection.owner !== "0" &&
      mipCollection.owner !== "0x0"
        ? `0x${BigInt(mipCollection.owner).toString(16)}`
        : "";
    const resolvedTotalSupply = Number(totalSupply);

    const ipfsUri = resolveIpfsUrl(mipCollection.base_uri);
    const collectionMetadata = await fetch(ipfsUri).then((res) => res.json());
    const imageUrl = resolveIpfsUrl(
      collectionMetadata.image || collectionMetadata.assetUrl,
    );

    const creatorId = resolvedOwner;
    return {
      id: resolvedCollectionId,
      slug: mipCollection.symbol,
      name: mipCollection.name,
      type: collectionMetadata.type,
      category: collectionMetadata.type,
      tags: collectionMetadata.type,
      description: collectionMetadata.description,
      coverImage: imageUrl,
      bannerImage: imageUrl,
      assets: resolvedTotalSupply,
      createdAt: collectionMetadata.createdAt,
      updatedAt: collectionMetadata.updatedAt || collectionMetadata.createdAt,
      isPublic: collectionMetadata.visibility === "public",
      isFeatured: mipCollection.is_active,
      blockchain: "Starknet",
      contractAddress: collectionAddress,
      creator: {
        id: creatorId,
        username: creatorId,
        name: creatorId,
        avatar: resolveIpfsUrl(collectionMetadata.assetUrl),
        verified: mipCollection.is_active,
        wallet: creatorId,
      },
    };
  } catch (error) {
    console.error("Error fetching collection metadata:", error);
    throw error;
  }
}

function mapStringToLicenseType(value: string) {
  switch (value.toLowerCase()) {
    case "cc-by":
    case "cc-by-sa":
    case "creative commons":
      return "Creative Commons";
    case "commercial":
    case "commercial use":
      return "Commercial Use";
    case "personal":
    case "personal use":
      return "Personal Use";
    case "exclusive":
    case "exclusive rights":
      return "Exclusive Rights";
    case "mit":
    case "apache-2.0":
    case "gpl-3.0":
    case "open source":
      return "Open Source";
    default:
      return undefined;
  }
}

export async function getCollectionAssets(
  collectionAddress: string,
): Promise<Asset[]> {
  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_RPC_URL!,
  });
  const collectionContract = await getContract(provider, collectionAddress);

  const totalSupply = await collectionContract.total_supply();
  const tokenIds = Array.from({ length: Number(totalSupply) }, (_, i) => i);

  const owners = (
    await Promise.allSettled(
      tokenIds.map((id) => collectionContract.owner_of(id)),
    )
  )
    .map((result, index) => {
      if (result.status === "fulfilled") {
        const owner =
          result.value && result.value != "0" && result.value != "0x0"
            ? `0x${BigInt(result.value).toString(16)}`
            : "";
        if (!owner) {
          return null;
        }
        return { owner, tokenId: index };
      }
      console.error(
        `Failed to get Owner for token ID ${index}:`,
        result.reason,
      );
      return null;
    })
    .filter(Boolean);

  const urls = (
    await Promise.allSettled(
      owners.map(({ tokenId }) => collectionContract.token_uri(tokenId)),
    )
  )
    .map((result, index) => {
      const { tokenId } = owners[index];
      if (result.status === "fulfilled") {
        return {
          tokenId,
          uri: resolveIpfsUrl(result.value),
        };
      }
      console.error(
        `Failed to get URI for token ID ${tokenId}:`,
        result.reason,
      );
      return null;
    })
    .filter(Boolean);

  const metadataPromises = urls.map(async ({ tokenId, uri }) => {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const metadata = await response.json();
      return {
        tokenId,
        metadata,
      };
    } catch (error) {
      console.error(
        `Failed to fetch metadata for token ID ${tokenId} from ${uri}:`,
        error,
      );
      return {
        tokenId,
        metadata: null,
        error: error.message,
      };
    }
  });
  const tokenMetadata = (await Promise.all(metadataPromises)).map((meta) => {
    const licenseAttribute = meta.metadata.attributes.find(
      (attr) => attr.trait_type === "License",
    );
    const licenseType = mapStringToLicenseType(licenseAttribute.value)!;

    const IPAttribute = meta.metadata.attributes.find(
      (attr) => attr.trait_type === "Type",
    );
    const asset: Asset = {
      id: `${collectionAddress}-${meta.tokenId}`,
      name: meta.metadata.name,
      creator: owners[meta.tokenId]!.owner,
      verified: true,
      image: meta.metadata.assetUrl,
      collection: collectionAddress,
      licenseType,
      description: meta.metadata.description,
      type: IPAttribute.value,
      metadata: meta.metadata,
    };
    return asset;
  });

  return tokenMetadata;
}
