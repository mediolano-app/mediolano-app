import { useConnect, useDisconnect, useAccount } from '@starknet-react/core';
import { LogOut, LogOutIcon, LucideLogOut, Wallet } from 'lucide-react';

const WalletBar: React.FC = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();



  return (
    <div className="flex flex-col items-center space-y-4 hidden md:flex md:flex-1">
      {!address ? (
        <div className="flex flex-wrap justify-center gap-4">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="rounded-lg bg-blue/20 py-4 px-7 hover:bg-blue/50"
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
            className="py-2 px-2 flex items-center justify-center"
          >
            {address.slice(0, 6)}...{address.slice(-4)} &nbsp; <LucideLogOut className='h-4 w-4'/>
          </button>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default WalletBar;
