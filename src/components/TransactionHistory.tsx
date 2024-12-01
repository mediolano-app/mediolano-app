import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  const mockTransactions = [
    {
      id: "1",
      assetName: "Digital Artwork #1",
      type: "Sale",
      price: "0.5 ETH",
      buyer: "0x1234...5678",
      date: "2023-11-28",
      status: "Completed",
    },
    {
      id: "2",
      assetName: "Music Composition: Summer Breeze",
      type: "Transfer",
      price: "N/A",
      buyer: "0x9876...5432",
      date: "2023-11-27",
      status: "Pending",
    },
    {
      id: "3",
      assetName: "E-book: The Future of AI",
      type: "Sale",
      price: "0.2 ETH",
      buyer: "0xabcd...efgh",
      date: "2023-11-26",
      status: "Completed",
    },
  ]
  
  export function TransactionHistory() {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        <Table>
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>PriceTableHead>Price</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.assetName}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.price}</TableCell>
                <TableCell>{transaction.buyer}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
  
  