import { PinataSDK } from "pinata-web3";

export const pinataClient = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "",
  pinataGateway: process.env.PINATA_HOST || "violet-adjacent-skink-713.mypinata.cloud" 
});
