import {connect, disconnect} from  '@argent/get-starknet'



export default function WalletConnectModal(){

    const connectWallet = async () => {
        let conection =  await connect({webWalletUrl: "https://web.argent.xyz" });
      }

    return (
        <button onClick={connectWallet}>Connect Wallet </button>
    )
}