"use client";
import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Contract, RpcProvider, constants, uint256 } from 'starknet';

// Define FELT type locally since it's not exported by starknet
type FELT = string;
import { abi as CONTRACT_ABI } from '../../abis/abi';

// Medialano Protocol contract details
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP || '0x04d9e99204dbfe644fc5ed7529d983ed809b7a356bf0c84daade57bcbb9c0c77'; 

// Initialize a Starknet provider using RpcProvider
const provider = new RpcProvider({
  nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
  chainId: constants.StarknetChainId.SN_SEPOLIA,
});

// Create a contract instance
const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);

interface OwnershipData {
  owner: string;
  creationDate: string;
  licensingTerms: string;
  transactionHistory: Array<{ txHash: string; date: string; action: string }>;
  berneConventionCompliant: boolean;
  verificationStatus: 'verified' | 'unverified' | 'pending';
}

interface ProofOfOwnershipProps {
  defaultAssetId?: string;
}

type VerificationMethod = 'assetId' | 'transactionHash' | 'certificateId';

const ProofOfOwnership: React.FC<ProofOfOwnershipProps> = ({ defaultAssetId = '' }) => {
  const [activeMethod, setActiveMethod] = useState<VerificationMethod>('assetId');
  const [assetId, setAssetId] = useState(defaultAssetId);
  const [ownershipData, setOwnershipData] = useState<OwnershipData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (assetId || contractAddress) {
      fetchOwnershipData(assetId, activeMethod, contractAddress);
    }
  };

  const fetchOwnershipData = async (id: string, method: VerificationMethod, contractAddr?: string) => {
    setLoading(true);
    setError(null);
    setOwnershipData(null);
    try {
      if (method === 'assetId') {
        // If both provided, use both
        if (id && contractAddr) {
          // Convert id to u256 (as string or number) using BigInt for robustness
          let tokenIdU256;
          try {
            tokenIdU256 = uint256.bnToUint256(BigInt(id));
          } catch (e) {
            setError('Invalid Asset ID format. Please use a valid decimal or hex (0x...) number.');
            setLoading(false);
            return;
          }
          // Use the provided contract address or default
          const contractToUse = new Contract(CONTRACT_ABI, contractAddr, provider);
          const owner = await contractToUse.owner_of(tokenIdU256);
          // Fetch token URI (metadata)
          let metadataUri = '';
          try {
            const uriResult = await contractToUse.token_uri(tokenIdU256);
            if (uriResult && uriResult.data && Array.isArray(uriResult.data)) {
              // Convert each bytes31 (FELT) to string (browser-safe, no Buffer)
              metadataUri = uriResult.data.map((felt: FELT) => {
                // Convert felt to hex, then to UTF-8 string (strip trailing zeros)
                let hex = BigInt(felt).toString(16).padStart(62, '0');
                let str = '';
                for (let i = 0; i < hex.length; i += 2) {
                  const byte = parseInt(hex.slice(i, i + 2), 16);
                  if (byte === 0) break;
                  str += String.fromCharCode(byte);
                }
                return str;
              }).join('').replace(/\0+$/, '');
            }
          } catch (e) {
            console.warn("Could not fetch or decode token_uri:", e);
            metadataUri = '';
          }
          let creationDate = 'N/A';
          let licensingTerms = 'N/A';
          if (metadataUri && metadataUri.startsWith('http')) {
            try {
              const resp = await fetch(metadataUri);
              if (resp.ok) {
                const meta = await resp.json();
                creationDate = meta.creation_date || 'N/A';
                licensingTerms = meta.licensing_terms || 'N/A';
              } else {
                console.warn(`Failed to fetch metadata from URI: ${metadataUri}, Status: ${resp.status}`);
              }
            } catch (e) {
              console.error("Error parsing metadata JSON:", e);
            }
          }
          setOwnershipData({
            owner: owner.toString(),
            creationDate,
            licensingTerms,
            transactionHistory: [],
            berneConventionCompliant: true,
            verificationStatus: owner ? 'verified' : 'unverified',
          });
        } else if (contractAddr) {
          // ...fetch contract info, or show message: "Please provide Asset ID to verify a specific token."
          setError('Please provide an Asset ID to verify a specific token in this contract.');
          setLoading(false);
          return;
        } else if (id) {
          // ...verify tokenId on default contract...
          // Convert id to u256 (as string or number) using BigInt for robustness
          let tokenIdU256;
          try {
            tokenIdU256 = uint256.bnToUint256(BigInt(id));
          } catch (e) {
            setError('Invalid Asset ID format. Please use a valid decimal or hex (0x...) number.');
            setLoading(false);
            return;
          }
          // Use the provided contract address or default
          const contractToUse = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);
          const owner = await contractToUse.owner_of(tokenIdU256);
          // Fetch token URI (metadata)
          let metadataUri = '';
          try {
            const uriResult = await contractToUse.token_uri(tokenIdU256);
            if (uriResult && uriResult.data && Array.isArray(uriResult.data)) {
              // Convert each bytes31 (FELT) to string (browser-safe, no Buffer)
              metadataUri = uriResult.data.map((felt: FELT) => {
                // Convert felt to hex, then to UTF-8 string (strip trailing zeros)
                let hex = BigInt(felt).toString(16).padStart(62, '0');
                let str = '';
                for (let i = 0; i < hex.length; i += 2) {
                  const byte = parseInt(hex.slice(i, i + 2), 16);
                  if (byte === 0) break;
                  str += String.fromCharCode(byte);
                }
                return str;
              }).join('').replace(/\0+$/, '');
            }
          } catch (e) {
            console.warn("Could not fetch or decode token_uri:", e);
            metadataUri = '';
          }
          let creationDate = 'N/A';
          let licensingTerms = 'N/A';
          if (metadataUri && metadataUri.startsWith('http')) {
            try {
              const resp = await fetch(metadataUri);
              if (resp.ok) {
                const meta = await resp.json();
                creationDate = meta.creation_date || 'N/A';
                licensingTerms = meta.licensing_terms || 'N/A';
              } else {
                console.warn(`Failed to fetch metadata from URI: ${metadataUri}, Status: ${resp.status}`);
              }
            } catch (e) {
              console.error("Error parsing metadata JSON:", e);
            }
          }
          setOwnershipData({
            owner: owner.toString(),
            creationDate,
            licensingTerms,
            transactionHistory: [],
            berneConventionCompliant: true,
            verificationStatus: owner ? 'verified' : 'unverified',
          });
        } else {
          setError('Please provide at least Asset ID or Contract Address.');
          setLoading(false);
          return;
        }
      } else if (method === 'transactionHash') {
        // Transaction hash verification: fetch transaction and infer asset
        try {
          // Starknet RPC: getTransactionByHash
          const tx = await provider.getTransactionByHash(id);
          // Try to infer tokenId from calldata (ERC721 transfer)
          let tokenId = null;
          // Only 'INVOKE' transactions have calldata
          if (tx && 'calldata' in tx && Array.isArray((tx as any).calldata)) {
            // ERC721 transfer: [from, to, tokenId]
            const calldata = (tx as { calldata: string[] }).calldata;
            if (calldata.length >= 3) {
              tokenId = calldata[2];
            }
          }
          if (!tokenId) {
            setError('Could not infer Asset ID from transaction. Only standard ERC721 transfers are supported.');
            setLoading(false);
            return;
          }
          // Recurse to assetId verification
          await fetchOwnershipData(tokenId, 'assetId');
        } catch (e) {
          setError('Failed to fetch transaction or parse asset from transaction hash. Make sure the hash is correct and the transaction is on Starknet.');
          setLoading(false);
        }
      } else if (method === 'certificateId') {
        // Certificate ID verification: map certificate to assetId (mock logic)
        try {
          // In a real system, this would query a registry or mapping contract
          // For demo, treat certificateId as tokenId
          await fetchOwnershipData(id, 'assetId');
        } catch (e) {
          setError('Failed to resolve certificate to asset. Please check the Certificate ID.');
          setLoading(false);
        }
      } else {
        setError('Unsupported verification method.');
        setLoading(false);
      }
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'An unknown error occurred.';
      setError(`Failed to fetch ownership data: ${errorMessage}. Make sure the Asset ID is valid and the network is correct.`);
      setOwnershipData(null); // Clear previous data on error
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholderText = () => {
    switch (activeMethod) {
      case 'assetId': return 'e.g., asset1, 0xabc...123';
      case 'transactionHash': return 'e.g., 0xdef...456';
      case 'certificateId': return 'e.g., cert789';
      default: return '';
    }
  };

  const getInputLabel = () => {
    switch (activeMethod) {
      case 'assetId': return 'Enter the Asset ID to verify its ownership information';
      case 'transactionHash': return 'Enter the Transaction Hash to verify its associated asset';
      case 'certificateId': return 'Enter the Certificate ID to verify asset details';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Verify Proof of Ownership</h1>
          <p className="text-[#a0a0a0] text-lg">
            Confirm the authenticity of intellectual property ownership claims on the blockchain
          </p>
        </div>

        {/* Verification Component Card */}
        {/* Main card background now uses the dark blue-grey from mockup for consistency */}
        <div className="flex justify-center mb-6 rounded-lg bg-[#3C3C4B] border border-[#343944] p-1"> {/* Outer container for tabs */}
            <button
              className={`py-3 px-6 text-lg font-medium rounded-md transition-colors duration-200 ${
                activeMethod === 'assetId'
                  ? 'bg-[#0C0F1A] text-white' // Active tab background, text white
                  : 'bg-transparent text-[#717175] hover:bg-[#0C0F1A] hover:text-white' // Inactive tab transparent, hover effect
              }`}
              onClick={() => { setActiveMethod('assetId'); setOwnershipData(null); setError(null); setAssetId('');}}
            >
              By Asset ID
            </button>
            <button
              className={`py-3 px-6 text-lg font-medium rounded-md transition-colors duration-200 ${
                activeMethod === 'transactionHash'
                  ? 'bg-[#0C0F1A] text-white'
                  : 'bg-transparent text-[#717175] hover:bg-[#0C0F1A] hover:text-white'
              }`}
              onClick={() => { setActiveMethod('transactionHash'); setOwnershipData(null); setError(null); setAssetId('');}}
            >
              By Transaction Hash
            </button>
            <button
              className={`py-3 px-6 text-lg font-medium rounded-md transition-colors duration-200 ${
                activeMethod === 'certificateId'
                  ? 'bg-[#0C0F1A] text-white'
                  : 'bg-transparent text-[#717175] hover:bg-[#0C0F1A] hover:text-white'
              }`}
              onClick={() => { setActiveMethod('certificateId'); setOwnershipData(null); setError(null); setAssetId('');}}
            >
              By Certificate ID
            </button>
          </div>
        <div className="bg-[#040312] rounded-xl p-6 sm:p-8 shadow-lg border border-[#343944]">
          {/* Input Form */}
          <div className="bg-[#040312] rounded-lg p-6 mb-8 border border-[#343944]">
            <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
              Verify by {activeMethod === 'assetId' ? 'Asset ID' : activeMethod === 'transactionHash' ? 'Transaction Hash' : 'Certificate ID'}
            </h3>
            <p className="text-[#a0a0a0] mb-4">{getInputLabel()}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-col">
              <div className="relative">
                <input
                  type="text"
                  value={assetId}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAssetId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#12141B] border border-[#343944] rounded-lg text-[var(--foreground)] placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-[#44588E]"
                  placeholder="Asset ID (optional)"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0a0]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
              </div>
              <input
                type="text"
                value={contractAddress}
                onChange={e => setContractAddress(e.target.value)}
                className="w-full px-4 py-3 bg-[#12141B] border border-[#343944] rounded-lg text-[var(--foreground)] placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-[#44588E]"
                placeholder="Contract Address (optional)"
              />
              <button
                type="submit"
                className="bg-[#44588E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a70af] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || (!assetId && !contractAddress)}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
            <p className="text-[#a0a0a0] text-sm mt-3">
              The {activeMethod === 'assetId' ? 'Asset ID' : activeMethod === 'transactionHash' ? 'Transaction Hash' : 'Certificate ID'} can be found on the asset&apos;s page or ownership certificate.
            </p>
          </div>

          {/* Verification Results */}
          {loading && (
            <div className="text-center text-[#44588E] my-4">
              <p>Fetching ownership data from Starknet...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#44588E] mx-auto my-3"></div>
            </div>
          )}
          {error && (
            <div className="bg-[#401212] border border-[#7C1F1F] text-[#F87171] p-4 rounded-lg my-4">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {ownershipData && (
            <div className="bg-[#040312] rounded-lg p-6 border border-[#343944]">
              <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Verification Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#a0a0a0]">
                <div className="flex items-center">
                  <span className="font-semibold text-[#a0a0a0] mr-2">Status:</span>
                  <span
                    className={`font-bold ${
                      ownershipData.verificationStatus === 'verified' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {ownershipData.verificationStatus.charAt(0).toUpperCase() + ownershipData.verificationStatus.slice(1)}
                  </span>
                </div>
                <div className="break-all">
                  <span className="font-semibold text-[#a0a0a0]">Owner Address (Current):</span>{' '}
                  <span className="block text-sm sm:inline">{ownershipData.owner}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#a0a0a0]">Creation Date:</span>{' '}
                  <span>{ownershipData.creationDate}</span>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <span className="font-semibold text-[#a0a0a0]">Licensing Terms:</span>{' '}
                  <span className="block text-sm sm:inline">{ownershipData.licensingTerms}</span>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <span className="font-semibold text-[#a0a0a0]">Berne Convention Compliant:</span>{' '}
                  <span
                    className={`font-bold ${
                      ownershipData.berneConventionCompliant ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {ownershipData.berneConventionCompliant ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {ownershipData.transactionHistory.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3 text-[var(--foreground)]">Transaction History</h4>
                  <ul className="space-y-2 text-[#a0a0a0]">
                    {ownershipData.transactionHistory.map((tx) => (
                      <li key={tx.txHash} className="bg-[#12141B] p-3 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm break-words border border-[#343944]">
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-semibold text-[#a0a0a0]">Tx Hash:</span>{' '}
                          <span className="font-mono text-[#44588E] break-all">{tx.txHash}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2 sm:ml-4">
                          <span className="font-semibold text-[#a0a0a0]">Date:</span>{' '}
                          <span>{tx.date}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2 sm:ml-4">
                          <span className="font-semibold text-[#a0a0a0]">Action:</span>{' '}
                          <span>{tx.action}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* About Proof of Ownership Verification Section */}
        {/* Main card background now uses the dark blue-grey from mockup for consistency */}
        <div className="mt-10 bg-[#040312] rounded-xl p-6 sm:p-8 shadow-lg border border-[#343944]">
          <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">About Proof of Ownership Verification</h2>
          <p className="text-[#a0a0a0] mb-6 leading-relaxed">
            Our blockchain verification system provides indisputable proof of intellectual property ownership. When you verify an asset, we check its records against our secure blockchain database to confirm authenticity.
          </p>

          <div className="space-y-6">
            <div className="bg-[#040312] rounded-lg p-5 border border-[#343944]">
              <div className="flex items-start mb-2">
                <span className="text-[#44588E] text-2xl mr-3">💡</span>
                <h3 className="text-xl font-semibold text-[var(--foreground)]">Verification Information</h3>
              </div>
              <p className="text-[#a0a0a0]">
                Successful verification confirms that the asset was registered on our platform and its ownership information is securely stored on the Starknet blockchain. This can be used as evidence in legal proceedings or licensing negotiations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#040312] rounded-lg p-5 border border-[#343944]">
                <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Legal Recognition</h3>
                <p className="text-[#a0a0a0] text-sm">
                  Verification results are recognized in 181 countries under the Berne Convention.
                </p>
              </div>
              <div className="bg-[#040312] rounded-lg p-5 border border-[#343944]">
                <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Immutable Records</h3>
                <p className="text-[#a0a0a0] text-sm">
                  Blockchain records cannot be altered, providing tamper-proof evidence of creation.
                </p>
              </div>
              <div className="bg-[#040312] rounded-lg p-5 border border-[#343944]">
                <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Instant Verification</h3>
                <p className="text-[#a0a0a0] text-sm">
                  Get immediate confirmation of ownership status with real-time blockchain queries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofOfOwnership;