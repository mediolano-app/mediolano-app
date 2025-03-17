'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Upload, RefreshCw, Award, User, Globe, Twitter, Linkedin, Github, Shield, Bell, Eye, Key, Save } from 'lucide-react'

// Mock user data
const mockUser = {
  address: "0x1a2b...3c4d",
  name: "Author Name",
  website: "https://mediolano.app",
  email: "mediolanoapp@gmail.com",
  socialMedia: {
    twitter: "@mediolanoapp",
    linkedin: "mediolano-app",
    github: "mediolano-app"
  },
  avatarUrl: "/background.jpg?height=100&width=100",
  coverUrl: "/background.jpg?height=300&width=1000",
  bio: "Decentralized IP enthusiast and blockchain innovator.",
  preferences: {
    marketProfile: false,
    emailNotifications: false,
    publicProfile: true,
    dataSharing: "anonymous"
  },
  transactions: [
    { id: "0xtx1", type: "Registration", asset: "Novel Manuscript", date: "2023-05-15", status: "Confirmed" },
    { id: "0xtx2", type: "License", asset: "Logo Design", date: "2023-06-02", status: "Pending" },
    { id: "0xtx3", type: "Royalty", asset: "AI Algorithm", date: "2023-06-10", status: "Confirmed" },
  ],
  stats: {
    nftAssets: 15,
    transactions: 47,
    listingItems: 3,
    nftCollections: 2,
    rewards: 500,
    badges: 7
  }
}

export default function UserAccount() {
  const [user, setUser] = useState(mockUser)
  const [theme, setTheme] = useState('light')
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl)
  const [coverPreview, setCoverPreview] = useState(user.coverUrl)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  const handlePreferenceChange = (preference: keyof typeof user.preferences, value: any) => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        [preference]: value
      }
    }))
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (type === 'avatar') {
            setAvatarPreview(reader.result)
          } else {
            setCoverPreview(reader.result)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    // Simulate saving to IPFS and blockchain
    console.log("Saving user data to IPFS and blockchain...")
    // Here you would typically make API calls to save the data
    setIsDrawerOpen(true)
  }

  const handleTransactionSign = async () => {
    // Simulate transaction signing
    console.log("Signing transaction...")
    // Here you would typically interact with the user's wallet
    setIsDrawerOpen(false)
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Account</h1>
          
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Profile and Preferences */}
          <Card className="col-span-full bg-background/90">
            <CardHeader>
              <CardTitle>Profile & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Section */}
              <div className="space-y-4">
                <div className="relative h-40 rounded-lg overflow-hidden mb-8">
                  <img src={coverPreview || "/background.jpg"} alt="Profile cover" className="w-full h-full object-cover" />
                  <Label htmlFor="cover-upload" className="absolute bottom-2 right-2 cursor-pointer">
                    <Input id="cover-upload" type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} accept="image/*" />
                    <div className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      Change Cover
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img src={avatarPreview || "/background.jpg"} alt="Avatar" className="w-20 h-20 rounded-full" />
                    <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
                      <Input id="avatar-upload" type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'avatar')} accept="image/*" />
                      <div className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 rounded-full flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                    </Label>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.address}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="name" defaultValue={user.name} className="pl-8" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (not visible)</Label>
                    <div className="relative">
                      <Globe className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="email" defaultValue={user.email} className="pl-8" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="website" defaultValue={user.website} className="pl-8" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">X</Label>
                    <div className="relative">
                      <Twitter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="twitter" defaultValue={user.socialMedia.twitter} className="pl-8" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="linkedin" defaultValue={user.socialMedia.linkedin} className="pl-8" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <div className="relative">
                      <Github className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="github" defaultValue={user.socialMedia.github} className="pl-8" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" defaultValue={user.bio} className="resize-none" />
                </div>
              </div>

              {/* Preferences Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label>Display Public Profile</Label>
                        <p className="text-sm text-muted-foreground">You can make your profile private by disabling this option.</p>
                      </div>
                    </div>
                    <Switch
                      checked={user.preferences.publicProfile}
                      onCheckedChange={(checked) => handlePreferenceChange('publicProfile', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates about your IP assets and account</p>
                      </div>
                    </div>
                    <Switch
                      checked={user.preferences.emailNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label>Marketplace Profile</Label>
                        <p className="text-sm text-muted-foreground">Allow others to see your profile and IP portfolio at the Marketplace</p>
                      </div>
                    </div>
                    <Switch
                      checked={user.preferences.marketProfile}
                      onCheckedChange={(checked) => handlePreferenceChange('marketProfile', checked)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data Sharing</Label>
                    <Select 
                      defaultValue={user.preferences.dataSharing}
                      onValueChange={(value) => handlePreferenceChange('dataSharing', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select data sharing level" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="anonymous">Anonymous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button className="w-full" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile & Preferences
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Confirm Transaction</DrawerTitle>
                    <DrawerDescription>
                      Please review and sign the transaction to save your profile and preferences to the blockchain.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-4">
                    <p>Transaction details:</p>
                    <ul className="list-disc list-inside">
                      <li>Update profile information</li>
                      <li>Update account preferences</li>
                      <li>Upload new images to IPFS</li>
                    </ul>
                    <Button onClick={handleTransactionSign} className="w-full">
                      <Key className="w-4 h-4 mr-2" />
                      Sign and Submit
                    </Button>
                  </div>
                </DrawerContent>
              </Drawer>
            </CardContent>
          </Card>

          {/* User Stats Widgets */}
          {Object.entries(user.stats).map(([key, value]) => (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {key.split(/(?=[A-Z])/).join(" ")}
                </CardTitle>
                {key === 'rewards' && <Award className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
              </CardContent>
            </Card>
          ))}

          {/* Recent Transactions */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell>{tx.asset}</TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{tx.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}