"use client";

import { useUsersSettings } from "@/hooks/useUsersSettings";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { GetSettingResponse } from "@/hooks/useUsersSettings";

export default function TestHooks() {
  const myPubKey = process.env.NEXT_PUBLIC_PUB_KEY as String;
  const { address } = useAccount(); 
  const {
    getSetting,
    verifySetting,
    storeSetting,
    removeSetting,
    updateWalletKey,
    contract,
  } = useUsersSettings();

  const [userSettings, setUserSettings] = useState<GetSettingResponse | null>(null);  
    const saveSetting = async () => {
    console.log("Saving setting...");
      try {
        const tx = await storeSetting(
          "user_key",               
          ["0xabc123", "0xdef456"],            
          ["0xsig1", "0xsig2"],                 
          myPubKey                     
        );
        console.log("Transaction sent:", tx.transaction_hash);
        try {
            const setting = await getSetting(address as string, "user_key");    
            setUserSettings(setting);
            console.log("Setting retrieved:", setting);
        }
        catch (getSettingError) {
            console.error("Failed to retrieve setting:", getSettingError);
        }
    } catch (saveSettingError) {
        console.error("Failed to store setting:", saveSettingError);
      }
    };


  return (
    <div>
      <h1>Test Hooks</h1>
      <p>Check the console for output.</p>
      <button
        onClick={async () => saveSetting()}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Setting
      </button>
    </div>
  );
}
