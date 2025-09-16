import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { usePortfolioLicensing } from '../hooks/usePortfolioLicensing';
import { IP } from '../hooks/useCreatorNFTPortfolio';

interface LicensingModalProps {
  asset: IP;
  onClose: () => void;
}

const LicensingModal: React.FC<LicensingModalProps> = ({ asset, onClose }) => {
  const { createLicense, isLoading, error } = usePortfolioLicensing();
  const [licenseTerms, setLicenseTerms] = useState({
    licenseType: 'Personal' as 'Personal' | 'Commercial' | 'Exclusive',
    licensee: '',
    startDate: '',
    endDate: '',
    terms: '',
    price: '',
  });

  const handleSubmit = async () => {
    try {
      await createLicense({
        nftId: asset.tokenId,
        tokenId: asset.tokenId,
        licenseType: licenseTerms.licenseType,
        licensee: licenseTerms.licensee,
        startDate: licenseTerms.startDate,
        endDate: licenseTerms.endDate,
        terms: licenseTerms.terms,
        price: parseFloat(licenseTerms.price),
      });
      onClose();
    } catch (err) {
      console.error('Failed to create license:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <Label htmlFor="licenseType" className="block text-sm font-medium text-muted-foreground">
          License Type
        </Label>
        <select
          id="licenseType"
          value={licenseTerms.licenseType}
          onChange={(e) =>
            setLicenseTerms({ ...licenseTerms, licenseType: e.target.value as 'Personal' | 'Commercial' | 'Exclusive' })
          }
          className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
        >
          <option value="Personal">Personal</option>
          <option value="Commercial">Commercial</option>
          <option value="Exclusive">Exclusive</option>
        </select>
      </div>
      <div className="mb-4">
        <Label htmlFor="licensee" className="block text-sm font-medium text-muted-foreground">
          Licensee Address
        </Label>
        <Input
          id="licensee"
          value={licenseTerms.licensee}
          onChange={(e) => setLicenseTerms({ ...licenseTerms, licensee: e.target.value })}
          placeholder="e.g., 0x123..."
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="startDate" className="block text-sm font-medium text-muted-foreground">
          Start Date
        </Label>
        <Input
          id="startDate"
          type="date"
          value={licenseTerms.startDate}
          onChange={(e) => setLicenseTerms({ ...licenseTerms, startDate: e.target.value })}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="endDate" className="block text-sm font-medium text-muted-foreground">
          End Date
        </Label>
        <Input
          id="endDate"
          type="date"
          value={licenseTerms.endDate}
          onChange={(e) => setLicenseTerms({ ...licenseTerms, endDate: e.target.value })}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="terms" className="block text-sm font-medium text-muted-foreground">
          Terms
        </Label>
        <Input
          id="terms"
          value={licenseTerms.terms}
          onChange={(e) => setLicenseTerms({ ...licenseTerms, terms: e.target.value })}
          placeholder="e.g., Usage rights for digital marketing"
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="price" className="block text-sm font-medium text-muted-foreground">
          Price (STRK)
        </Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={licenseTerms.price}
          onChange={(e) => setLicenseTerms({ ...licenseTerms, price: e.target.value })}
          placeholder="e.g., 0.1"
          className="w-full"
        />
      </div>
      {error && <p className="text-destructive text-sm mb-4">{error}</p>}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" size="default" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="default"
          size="default"
          onClick={handleSubmit}
          disabled={isLoading || !licenseTerms.licensee || !licenseTerms.startDate || !licenseTerms.endDate || !licenseTerms.terms || !licenseTerms.price}
        >
          {isLoading ? 'Creating...' : 'Create License'}
        </Button>
      </div>
    </div>
  );
};

export default LicensingModal;