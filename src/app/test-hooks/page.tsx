import { useUsersSettings } from "@/hooks/useUsersSettings";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { GetSettingResponse } from "@/hooks/useUsersSettings";
export default function TestHooks() {
  const { address } = useAccount(); 
  const {
    getSetting,
    verifySetting,
    storeSetting,
    removeSetting,
    updateWalletKey,
    contract,
  } = useUsersSettings();

  const [userSettings, setUserSettings] = useState<GetSettingResponse | null>(null);  useEffect(() => {
    const saveSetting = async () => {
      try {
        const tx = await storeSetting(
          "notifications_enabled",               // key
          ["0xabc123", "0xdef456"],              // encryptedData
          ["0xsig1", "0xsig2"],                  // walletSignature
          "0xuserpublickey"                      // pubKey
        );
        console.log("Transaction sent:", tx.transaction_hash);
        try {
            const setting = await getSetting(address as string, "notifications_enabled");    
            setUserSettings(setting);
            console.log("Setting retrieved:", setting);

        }
    } catch (err) {
        console.error("Failed to store setting:", err);
      }
    };

    saveSetting();
  }, [storeSetting]);

  return (
    <div>
      <h1>Test Hooks</h1>
      <p>Check the console for output.</p>
    </div>
  );
}
