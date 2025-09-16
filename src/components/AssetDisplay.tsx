import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useCreatorNFTPortfolio } from '../hooks/useCreatorNFTPortfolio';
import { useAccount } from '@starknet-react/core';
import LicensingModal from './LicensingModal';
import { ConnectWallet } from './ConnectWallet';

interface IP {
    tokenId: string;
    name: string;
    description: string;
    external_url: string;
    image: string;
    attributes: any[];
    collection: string;
}

const AssetDisplay: React.FC = () => {
  const { address } = useAccount();
  const { metadata, loading, error, tokenIds } = useCreatorNFTPortfolio();
  const [selectedAsset, setSelectedAsset] = useState<IP | null>(null);

  const handleAssetSelect = (asset: IP) => {
    setSelectedAsset(asset);
  };

  const closeModal = () => {
    setSelectedAsset(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Your Intellectual Property Assets</h1>
      {!address ? (
        <ConnectWallet />
      ) : (
        <>
          {loading && <p className="text-muted-foreground text-lg">Loading your assets...</p>}
          {error && <p className="text-destructive text-lg">{error}</p>}
          {metadata.length === 0 && !loading && !error && (
            <p className="text-muted-foreground text-lg">No assets found for this wallet.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {metadata.map((asset) => (
              <Card
                key={asset.tokenId}
                className={`cursor-pointer hover:shadow-xl transition-shadow ${
                  selectedAsset?.tokenId === asset.tokenId ? 'border-primary shadow-lg' : 'border-input'
                }`}
                onClick={() => handleAssetSelect(asset)}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold truncate">{asset.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{asset.collection}</p>
                </CardHeader>
                <CardContent>
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="w-full h-48 object-cover rounded-md mb-3"
                    onError={(e) => (e.currentTarget.src = '/images/placeholder.svg')}
                  />
                  <CardDescription className="text-sm line-clamp-2">{asset.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          {selectedAsset && (
            <Dialog open={!!selectedAsset} onOpenChange={closeModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Licensing Agreement</DialogTitle>
                </DialogHeader>
                <LicensingModal asset={selectedAsset} onClose={closeModal} />
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
};

export default AssetDisplay;