"use client"

import { useState, useEffect } from "react"
import type { Agreement } from "@/types/agreement"
import { mockAgreements } from "@/lib/mockupProofofLicensing"

// Mock user data for the current user
const MOCK_USER = {
  name: "Demo User",
  walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
}

interface UseAgreementsOptions {
  limit?: number
}

export function useAgreements(options: UseAgreementsOptions = {}) {
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAgreements = async () => {
      setIsLoading(true)

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Filter agreements by mock user address
        let filteredAgreements = mockAgreements.filter(
          (agreement) =>
            agreement.createdBy.toLowerCase() === MOCK_USER.walletAddress.toLowerCase() ||
            agreement.parties.some(
              (party) => party.walletAddress.toLowerCase() === MOCK_USER.walletAddress.toLowerCase(),
            ),
        )

        // Apply limit if specified
        if (options.limit) {
          filteredAgreements = filteredAgreements.slice(0, options.limit)
        }

        setAgreements(filteredAgreements)
      } catch (error) {
        console.error("Error fetching agreements:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgreements()
  }, [options.limit])

  return { agreements, isLoading }
}

// export function useAgreement(id: `0x${string}`) {
//     // Get the user's account for transactions
//     const { account } = useAccount();
  
//     // Get the provider for read-only contract calls
//     const { provider } = useProvider();
  
//     // State to store signature details
//     const [signatures, setSignatures] = useState([]);
  
//     // Fetch agreement metadata
//     const { data: metadata, isLoading: metadataLoading } = useReadContract({
//       abi: ip_licensing_agreement as Abi,
//       functionName: "get_metadata",
//       address: id,
//       args: [],
//     });
  
//     // Fetch list of signers
//     const { data: signers, isLoading: signersLoading } = useReadContract({
//       abi: ip_licensing_agreement as Abi,
//       functionName: "get_signers",
//       address: id,
//       args: [],
//     });
  
//     // Fetch signature count
//     const { data: signatureCount, isLoading: signatureCountLoading } = useReadContract({
//       abi: ip_licensing_agreement as Abi,
//       functionName: "get_signature_count",
//       address: id,
//       args: [],
//     });
  
//     // Fetch agreement owner
//     const { data: owner, isLoading: ownerLoading } = useReadContract({
//       abi: ip_licensing_agreement as Abi,
//       functionName: "get_owner",
//       address: id,
//       args: [],
//     });
  
//     // Fetch signature statuses and timestamps for all signers
//     useEffect(() => {
//       if (provider && signers && signers.length > 0) {
//         const fetchSignatures = async () => {
//           const signaturePromises = signers.map(async (signer) => {
//             try {
//               const hasSignedResult = await provider.callContract({
//                 contractAddress: id,
//                 entrypoint: "has_signed",
//                 calldata: [signer],
//               });
//               if (hasSignedResult[0] === "0x1") { // "0x1" indicates true
//                 const timestampResult = await provider.callContract({
//                   contractAddress: id,
//                   entrypoint: "get_signature_timestamp",
//                   calldata: [signer],
//                 });
//                 return {
//                   walletAddress: signer,
//                   timestamp: Number(timestampResult[0]), // Convert felt to number
//                 };
//               }
//               return null;
//             } catch (error) {
//               console.error(`Error fetching signature for ${signer}:`, error);
//               return null;
//             }
//           });
//           const signatureData = await Promise.all(signaturePromises);
//           setSignatures(signatureData.filter((sig) => sig !== null));
//         };
//         fetchSignatures();
//       }
//     }, [provider, signers, id]);
  
//     // Combine loading states
//     const isLoading = metadataLoading || signersLoading || signatureCountLoading || ownerLoading;
  
//     // Construct the agreement object
//     const agreement = useMemo(() => {
//       if (!metadata || !signers || !signatureCount || !owner) return null;
  
//       const title = metadata[0];
//       const description = metadata[1];
//       const ip_metadata_json = metadata[2];
//       let ip_metadata;
//       try {
//         ip_metadata = JSON.parse(ip_metadata_json || "{}");
//       } catch (error) {
//         console.error("Error parsing ip_metadata:", error);
//         ip_metadata = {};
//       }
//       const creation_timestamp = metadata[3];
//       const is_immutable = metadata[4];
//       const immutability_timestamp = metadata[5];
  
//       return {
//         id,
//         title: title, // Convert ByteArray to string
//         createdBy: owner,
//         ip_metadata, // Include parsed metadata for additional details
//       };
//     }, [id, metadata, signers, signatureCount, owner, signatures]);
  
//     // Function to sign the agreement
//     const signAgreement = async () => {
//       if (!account) throw new Error("No account connected");
//       await account.execute({
//         contractAddress: id,
//         entrypoint: "sign_agreement",
//         calldata: [],
//       });
//     };
  
//     // Function to finalize the agreement
//     const finalizeAgreement = async () => {
//       if (!account) throw new Error("No account connected");
//       await account.execute({
//         contractAddress: id,
//         entrypoint: "make_immutable",
//         calldata: [],
//       });
//     };
  
//     return { agreement, isLoading, signAgreement, finalizeAgreement };
//   }