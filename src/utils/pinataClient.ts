import { PinataSDK } from "pinata-web3";

export const pinataClient = new PinataSDK({
	pinataJwt: `${process.env.PINATA_JWT}`,
	pinataGateway: 'lavender-quickest-reptile-91.mypinata.cloud',
});
