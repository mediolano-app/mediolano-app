import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { truncateString } from "@/lib/utils"

interface AssetMetadataProps {
  nftData: {
    title: string
    tokenId: string
    tokenURI: string
    tokenStandard: string
    blockchain: string
    contractAddress: string
    symbol: string
  }
}


export function AssetMetadata({ nftData }: AssetMetadataProps) {
  // Construct metadata object from nftData
  const metadata = {
    "Token Name": nftData.title,
    "Token Symbol": nftData.symbol,
    "Token ID": nftData.tokenId,
    "Token URI": nftData.tokenURI || "Not available",
    "Token Standard": nftData.tokenStandard,
    "Blockchain": nftData.blockchain,
    "Contract Address": nftData.contractAddress,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Metadata</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
              <dd className="text-sm font-semibold">
                {key === "Token URI" && value !== "Not available" ? (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" hover:text-blue-800 hover:underline"
                    title={value}
                  >
                    {truncateString(value)}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

