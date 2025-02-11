import { useConnect, useDisconnect, useAccount } from '@starknet-react/core';
import { LogOut, LogOutIcon, LucideLogOut, Wallet } from 'lucide-react';

const WalletBarM: React.FC = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  return (
    <div className="flex flex-col items-center space-y-4">
      {!address ? (
        <div className="flex flex-wrap justify-center gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="rounded shadow text-sm py-4 px-4 bg-blue-500 rounded-lg"
            >
              Connect {connector.id}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="text-sm px-4 rounded">
            
            <button
            onClick={() => disconnect()}
            className="py-4 px-4 flex items-center justify-center bg-blue-900 rounded-lg"
          >
           Account: {address.slice(0, 6)}...{address.slice(-4)} &nbsp; <LucideLogOut className='h-4 w-4'/>
          </button>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default WalletBarM;
