"use client"

export function useWallet() {
  // Always return connected as true to avoid wallet connection UI
  return {
    connected: true,
    address: "0x7d2f37829730eD183B55Fd93C6371C79",
    loading: false,
    connectWallet: () => {},
    disconnect: () => {},
  }
}
