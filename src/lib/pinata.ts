const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_SECRET = process.env.PINATA_SECRET!;
const PINATA_JWT = process.env.PINATA_JWT!;
const PINATA_HOST = process.env.PINATA_HOST ?? 'api.pinata.cloud';

export const uploadToPinata = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`https://${PINATA_HOST}/pinning/pinFileToIPFS`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to upload to Pinata: ${res.statusText}`);
  }

  return res.json(); // Returns { IpfsHash, Timestamp }
};
