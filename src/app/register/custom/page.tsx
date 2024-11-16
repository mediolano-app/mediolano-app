'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Coins, Building, Car, Gem, Globe, Shield, DollarSign, ChartBar, Zap, BarChart, Lock, Search, PieChart, Network, Banknote } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function AssetTokenizationPage() {
  const [formData, setFormData] = useState({
    assetName: '',
    assetType: '',
    tokenSymbol: '',
    totalSupply: '',
    initialPrice: '',
    description: '',
    legalDocumentation: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, legalDocumentation: file }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    alert('Asset tokenization request submitted successfully!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Custom Assets Tokenization</h1>
        <Link
          href="/"
          className="flex items-center text-sm font-medium text-muted-foreground hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="w-full max-w-2xl mx-auto lg:max-w-none">
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
            <CardDescription>Provide information about the asset you want to tokenize.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="assetName">Asset Name</Label>
                <Input
                  id="assetName"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleChange}
                  placeholder="Enter the name of your asset"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetType">Asset Type</Label>
                <Select onValueChange={(value) => handleSelectChange('assetType', value)} value={formData.assetType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realEstate">Real Estate</SelectItem>
                    <SelectItem value="artwork">Artwork</SelectItem>
                    <SelectItem value="commodity">Commodity</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="debt">Debt</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenSymbol">Token Symbol</Label>
                <Input
                  id="tokenSymbol"
                  name="tokenSymbol"
                  value={formData.tokenSymbol}
                  onChange={handleChange}
                  placeholder="Enter a symbol for your token (e.g., BTC, ETH)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSupply">Total Supply</Label>
                <Input
                  id="totalSupply"
                  name="totalSupply"
                  type="number"
                  value={formData.totalSupply}
                  onChange={handleChange}
                  placeholder="Enter the total number of tokens"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialPrice">Initial Token Price (USD)</Label>
                <Input
                  id="initialPrice"
                  name="initialPrice"
                  type="number"
                  value={formData.initialPrice}
                  onChange={handleChange}
                  placeholder="Enter the initial price per token"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Asset Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of the asset"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalDocumentation">Legal Documentation</Label>
                <Input
                  id="legalDocumentation"
                  name="legalDocumentation"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>

              <Button type="submit" className="w-full">Submit Tokenization Request</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Benefits of Asset Tokenization</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Coins className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Increased liquidity for traditionally illiquid assets</span>
                </li>
                <li className="flex items-center">
                  <Globe className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Global access to investment opportunities</span>
                </li>
                <li className="flex items-center">
                  <ChartBar className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Fractional ownership enabling smaller investments</span>
                </li>
                <li className="flex items-center">
                  <Shield className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Enhanced security and transparency through blockchain</span>
                </li>
                <li className="flex items-center">
                  <Zap className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Faster and more efficient transactions</span>
                </li>
                <li className="flex items-center">
                  <DollarSign className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Potential for reduced costs in asset management</span>
                </li>
                <li className="flex items-center">
                  <Lock className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Programmable compliance and automated dividends</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tokenizable Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-2 gap-4">
                <li className="flex items-center">
                  <Building className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Real Estate</span>
                </li>
                <li className="flex items-center">
                  <Gem className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Fine Art</span>
                </li>
                <li className="flex items-center">
                  <Car className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Collectibles</span>
                </li>
                <li className="flex items-center">
                  <PieChart className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Company Shares</span>
                </li>
                <li className="flex items-center">
                  <Banknote className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Debt Instruments</span>
                </li>
                <li className="flex items-center">
                  <Coins className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Commodities</span>
                </li>
                <li className="flex items-center">
                  <Network className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Intellectual Property</span>
                </li>
                <li className="flex items-center">
                  <Building className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Infrastructure</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Search className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Advanced asset discovery and analysis tools</span>
                </li>
                <li className="flex items-center">
                  <BarChart className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Real-time market data and performance tracking</span>
                </li>
                <li className="flex items-center">
                  <Lock className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Secure wallet integration for token management</span>
                </li>
                <li className="flex items-center">
                  <DollarSign className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Automated compliance and dividend distribution</span>
                </li>
                <li className="flex items-center">
                  <Globe className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Global marketplace for tokenized assets</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}