import { PinataSDK } from "pinata-web3";

export const pinataClient = new PinataSDK({
<<<<<<< Updated upstream
	pinataJwt: `${process.env.PINATA_JWT}`,
	pinataGateway: 'lavender-quickest-reptile-91.mypinata.cloud',
=======
  pinataJwt: process.env.PINATA_JWT || "",
  pinataGateway: process.env.PINATA_HOST || "violet-adjacent-skink-713.mypinata.cloud" 
>>>>>>> Stashed changes
});
