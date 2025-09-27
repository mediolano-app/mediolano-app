import type { WalletProvider } from "./types"
import { Wallet, Lock, Shield } from "lucide-react"

export const walletProviders: WalletProvider[] = [
  {
    id: "starknet-wallet",
    name: "Starknet Wallet",
    icon: Wallet,
  },
  {
    id: "argent-x",
    name: "Ready",
    icon: Shield,
  },
  {
    id: "braavos",
    name: "Braavos",
    icon: Lock,
  },
]
