import { useConnect, useDisconnect, useAccount } from '@starknet-react/core';
import { LogOut, LogOutIcon, LucideLogOut, Wallet } from 'lucide-react';
import { Button } from '../ui/button';

const WalletBarM: React.FC = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  return (

    <div className="space-y-4 mb-5">
     
      {!address ? (

        <div className="flex flex-wrap justify-center gap-2">
          {connectors.map((connector) => (


            <Button
            variant="default"
            size="lg"
            className="w-full"
            key={connector.id}
            onClick={() => connect({ connector })}
            >
            Connect {connector.id}
            </Button>

          ))}
        </div>


      ) : (
        
        <div className="space-y-4">
         
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => disconnect()}
          >
            <span className='text-muted'>Account:</span>&nbsp; {address.slice(0, 6)}...{address.slice(-4)} &nbsp; &nbsp; <LucideLogOut className='h-4 w-4 text-muted'/>
          </Button>


          
        </div>
      )}


    </div>
  );
};

export default WalletBarM;
