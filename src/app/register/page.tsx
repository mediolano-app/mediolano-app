"use client"

import { useState, useEffect } from 'react'
import { FilePlus, Lock, FileText, Coins, Shield, Globe, BarChart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { useAccount, useNetwork, useContract, useSendTransaction } from '@starknet-react/core'
import { type Abi } from "starknet"
import { abi } from '@/abis/abi'
import { Toaster } from "@/components/ui/toaster";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export type IPType = "" | "patent" | "trademark" | "copyright" | "trade_secret";

export interface IP{
  name: string,
  description: string,
  author: string,
  type: string,
  image: string,
  version: string,
  external_url: string,
}


export default function RegisterIP() {
  const pinataGateway = 'lavender-quickest-reptile-91.mypinata.cloud';
  
  const { toast } = useToast()


  const { address } = useAccount();
  console.log("URL:", address);
  const { chain } = useNetwork();
  const { contract } = useContract({ 
    abi: abi as Abi, 
    address: "0x03afbbb4d6530b36e65a1dd2e7a26d21834ab3eb013c998a2eac18235f6b18e8", 
  }); 

  const myAddress = "0x04d9e99204dbfe644fc5ed7529d983ed809b7a356bf0c84daade57bcbb9c0c77"
   

  const gateway = "https://violet-rainy-shrimp-423.mypinata.cloud/ipfs/";
  
  const router = useRouter();  
  const [status, setStatus] = useState("Mint NFT");
  const [ipfsHash, setIpfsHash] = useState("");

  const baseIpfsUrl = "https://ipfs.io/ipfs/";

  const [loading, setLoading] = useState(false);
  const [ipData, setIpData] = useState<IP>({
    name: '',
    description: '',
    author: '',
    type: '',
    image: '',
    version: '',
    external_url: '',
    });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setIpData((prev) => ({...prev, [name]: value}));
  };

  const handleAuthorChange = (index: number, value: string) => {
    const newauthor = [...ipData.author]
    newauthor[index] = value
    setIpData(prev => ({ ...prev, author: newauthor }))
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const { send, error: mintError} = useSendTransaction({ 
    calls: 
      contract && address 
        ? [contract.populate("mint_item", [address, ipfsHash])] 
        : undefined, 
  }); 

  const handleMintItem = async () => {
    try {
      send();
      console.log("Mint sent")
    }
    catch(error){
      console.error("Mint error: ", mintError); 
    }    
  };

  // async function mintItem(){
  //   try {
  //     console.log("entrei no try do mint")
  //     const tokenId = await contract.mint_item(myAddress, ipfsHash);
  //     console.log(tokenId);
  //   }
  //   catch (e) {
  //     console.log(e);
  //   }
  // }

  const handleSubmit = async (event: React.FormEvent) => {
    console.log(ipData);
    event.preventDefault();
    
    setIsSubmitting (true);
    setError(null);

    const submitData = new FormData();
    
    submitData.append('name', ipData.name);
    submitData.append('description', ipData.description);
    if (Array.isArray(ipData.author)) {
        ipData.author.forEach((author, index) => {
          submitData.append(`author[${index}]`, author)
        })
      } else {
        submitData.append('author', ipData.author);
      }
      
    submitData.append('type', ipData.type);

    submitData.append('image', ipData.image);
    submitData.append('version', ipData.version);
    submitData.append('external_url', ipData.external_url);
    
    if (file) {
      submitData.set('uploadFile', file);
    }

    for (let pair of submitData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    } //just for checking

    try {
      const response = await fetch('/api/forms-ipfs', {
        method: 'POST',
        body: submitData,
      });
      console.log("POST done, waiting for response");
      if (!response.ok) {
        throw new Error('Failed to submit IP')
      }
      console.log('IP submitted successfully');

      
      const data = await response.json();
      const ipfs = data.uploadData.IpfsHash as string;
      console.log(ipfs);
      setIpfsHash(ipfs);

      toast({
        title: "IP Protected",
        description: "Your intellectual property has been successfully registered on the Starknet blockchain. You can manage your registrations through the ‘Portfolio’ area of ​​the Mediolano dapp.",
        action: (
          <ToastAction altText="Open Portfolio">View</ToastAction>
        ),
      });
      
    } catch (err) {
        setError('Failed submitting or minting IP. Please try again.');

    } finally {
        setIsSubmitting(false);
        toast({
          title: "Failer",
          description: "Registration failed. Please contact our support team.",
          action: (
            <ToastAction altText="Open Portfolio">View</ToastAction>
          ),
        });
    }
  };

  useEffect(()=> {
    handleMintItem();
    // mintItem();
  }, [ipfsHash]);







  return (

  <div className="container mx-auto px-4 py-8 mt-10 mb-20">
    <h1 className="text-4xl font-bold text-center mb-8">Intellectual Property Registration</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    
    <div className="text-card-foreground">
    <Card>
    <CardHeader>
      <CardTitle>Create new IP</CardTitle>
      <CardDescription>Register your intellectual property on Starknet blockchain.</CardDescription>
    </CardHeader>
    <CardContent>
 
  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label htmlFor="name" className="block mb-1 font-medium">Title</label>
      <input 
        type="text" 
        id="name" 
        name="name"
        placeholder='Intellectual Property Name'
        value={ipData.name}
        onChange={handleChange}
        className="w-full rounded input input-bordered border bg-white dark:bg-black p-2" 
        required 
      />
      </div>
    <div>
      <label htmlFor="description" className="block mb-1 font-medium">Description</label>
      <textarea 
        id="description" 
        name="description" 
        placeholder='Intellectual Property Content/Description'
        value={ipData.description}
        onChange={handleChange}
        className="w-full rounded input input-bordered border  bg-white dark:bg-black p-2" 
        rows={4}
        required
      ></textarea>
    </div>
    <div>
      <label htmlFor="author" className="block mb-1 font-medium">Author</label>
      <input 
        type="text" 
        id="author" 
        name="author"
        placeholder='Author(s)'
        value={ipData.author}
        onChange={handleChange} 
        className="w-full rounded input input-bordered border bg-white dark:bg-black p-2" 
        required 
      />
      </div>
    <div>
      <label htmlFor="type" className="block mb-1 font-medium">Type</label>
      <select 
        id="type" 
        name="type" 
        value={ipData.type}
        onChange={ (e:any) => {
          setIpData((prev) => ({ ...prev, "type": e.target.value }));
          console.log(e);
        }}
        className="w-full rounded input input-bordered border bg-white dark:bg-black p-2"
      >
        <option value="copyright">Copyright</option>
        <option value="patent">Patent</option>
        <option value="trademark">Trademark</option>
        <option value="trade_secret">Trade Secret</option>
        <option value="trade_secret">Other</option>
      </select>
    </div>
    <div>
      <label htmlFor="image" className="block mb-1 font-medium">Image Preview URL</label>
      <input 
        type="text" 
        id="image" 
        name="image"
        placeholder='https://your-image-address'
        value={ipData.image}
        onChange={handleChange} 
        className="w-full rounded input input-bordered border bg-white dark:bg-black p-2" 
        required 
      />
      </div>
      <div>
      <label htmlFor="external_url" className="block mb-1 font-medium">External Link URL</label>
      <input 
        type="text" 
        id="external_url" 
        name="external_url"
        placeholder='https://your-link-address'
        value={ipData.external_url}
        onChange={handleChange} 
        className="w-full rounded input input-bordered border bg-white dark:bg-black p-2" 
      />
      </div>
      <div>
      <label htmlFor="version" className="block mb-1 font-medium">Version</label>
      <input 
        type="text" 
        id="version" 
        name="version"
        placeholder='IP Version (Optional)'
        value={ipData.version}
        onChange={handleChange} 
        className="w-full rounded input input-bordered border bg-white dark:bg-black p-2"  
      />
      </div>
    
    <button type="submit" className="px-6 py-4 flex items-center justify-center w-full rounded input input-bordered bg-blue-600">
      <FilePlus className="h-5 w-5 mr-2" /> Register IP
    </button>
  </form>
  </CardContent>
    <CardFooter className="flex justify-between">
    </CardFooter>
  </Card>
  </div>



<div>

  <Card  className="rounded-lg shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
  <div className="text-card-foreground rounded-lg p-6">


  
    <div className="py-2">
      <h2 className="text-2xl font-semibold mb-2">Blockchain IP Registration Features</h2>
      <p className="text-muted-foreground mb-4">Secure, transparent, and efficient</p>
      </div>
    
      <ul className="space-y-6">
        <li className="flex items-start">
          <Lock className="w-6 h-6 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Immutable Protection</h3>
            <p className="text-sm text-muted-foreground">Your IP is securely stored on the blockchain, providing tamper-proof evidence of ownership and creation date.</p>
          </div>
        </li>
        <li className="flex items-start">
          <FileText className="w-6 h-6 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Smart Licensing</h3>
            <p className="text-sm text-muted-foreground">Utilize smart contracts for automated licensing agreements, ensuring proper attribution and compensation.</p>
          </div>
        </li>
        <li className="flex items-start">
          <Coins className="w-6 h-6 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Tokenized Monetization</h3>
            <p className="text-sm text-muted-foreground">Transform your IP into digital assets, enabling fractional ownership and new revenue streams.</p>
          </div>
        </li>
        <li className="flex items-start">
          <Shield className="w-6 h-6 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Enhanced Security</h3>
            <p className="text-sm text-muted-foreground">Benefit from blockchain's cryptographic security, protecting your IP from unauthorized access and tampering.</p>
          </div>
        </li>
        <li className="flex items-start">
          <Globe className="w-6 h-6 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Global Accessibility</h3>
            <p className="text-sm text-muted-foreground">Access and manage your IP rights from anywhere in the world, facilitating international collaborations and licensing.</p>
          </div>
        </li>
        <li className="flex items-start">
          <BarChart className="w-6 h-6 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Analytics and Insights</h3>
            <p className="text-sm text-muted-foreground">Gain valuable insights into your IP portfolio's performance and market trends through blockchain-powered analytics.</p>
          </div>
        </li>
      </ul>
    </div>
    </Card>

    </div>
  </div>

</div>

  )
}