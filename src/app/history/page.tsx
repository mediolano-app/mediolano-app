import React, { useEffect, useState } from 'react'
import { Provider } from "starknet";


const provider = new Provider({ network: "mainnet-alpha" });

async function fetchTransferHistory(tokenId) {
  const transactions = await provider.getTransactionHistory(tokenId);
  return transactions.map((tx) => ({
    transactionId: tx.transaction_hash,
    from: tx.sender_address,
    to: tx.receiver_address,
    timestamp: tx.timestamp,
    amount: tx.amount,
  }));
}

const History = () => {
  const [transferHistory, setTransferHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const tokenId = "your-token-id"; // Replace with your actual token ID
    fetchTransferHistory(tokenId).then(setTransferHistory);

    const interval = setInterval(async () => {
      const updatedHistory = await fetchTransferHistory(tokenId);
      setTransferHistory(updatedHistory);
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const itemsPerPage = 10;
  const paginatedData = transferHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="py-10 mb-20 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-8">Transfer History</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by NFT ID, Wallet Address, or Transaction Hash"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input rounded-md p-2 w-full"
        />
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Transaction ID</th>
            <th className="border border-gray-300 px-4 py-2">From</th>
            <th className="border border-gray-300 px-4 py-2">To</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((tx) => (
            <tr key={tx.transactionId}>
              <td className="border border-gray-300 px-4 py-2">{tx.transactionId}</td>
              <td className="border border-gray-300 px-4 py-2">{tx.from}</td>
              <td className="border border-gray-300 px-4 py-2">{tx.to}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(tx.timestamp).toLocaleString()}</td>
              <td className="border border-gray-300 px-4 py-2">{tx.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default History
