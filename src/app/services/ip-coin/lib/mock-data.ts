import { formatDistanceToNow } from "date-fns"

// Generate random date within the last 30 days
const randomRecentDate = () => {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 30) + 1
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  return date
}

// Generate random price history data
const generatePriceHistory = (days: number, startPrice: number, volatility = 0.05, trend = 0.01) => {
  const history = []
  let currentPrice = startPrice

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Add some randomness with a slight trend
    const change = (Math.random() - 0.5) * volatility + trend
    currentPrice = Math.max(0.00001, currentPrice * (1 + change))

    history.push({
      date: date.toISOString().split("T")[0],
      price: currentPrice,
      formattedDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    })
  }

  return history
}

// Generate random volume data
const generateVolumeData = (days: number, avgVolume: number, volatility = 0.3) => {
  const volumes = []

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Random volume with high volatility
    const volume = avgVolume * (1 + (Math.random() - 0.5) * volatility)

    volumes.push({
      date: date.toISOString().split("T")[0],
      volume: volume,
      formattedDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    })
  }

  return volumes
}

// Generate random transactions
const generateTransactions = (count: number, tokenSymbol: string, price: number) => {
  const types = ["buy", "sell"]
  const transactions = []

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const amount = (Math.random() * 0.05 + 0.001).toFixed(3)
    const tokens = (Number.parseFloat(amount) / price).toFixed(1)
    const date = randomRecentDate()

    transactions.push({
      id: `tx-${i}-${Date.now()}`,
      type,
      user: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      amount: `${amount} ETH`,
      tokens: `${tokens} ${tokenSymbol}`,
      tokenAmount: Number.parseFloat(tokens),
      date,
      timeAgo: formatDistanceToNow(date, { addSuffix: true }),
      change: type === "buy" ? `+${tokens}` : `-${tokens}`,
    })
  }

  // Sort by date (newest first)
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
}

// Generate random holders
const generateHolders = (count: number, totalSupply: number) => {
  const holders = []
  let remainingSupply = totalSupply

  for (let i = 0; i < count - 1; i++) {
    // Creator holds between 30-60% of supply
    const percentage = i === 0 ? Math.random() * 30 + 30 : Math.random() * Math.min(remainingSupply, 25)

    const holdingAmount = Math.floor((percentage / 100) * totalSupply)
    remainingSupply -= percentage

    holders.push({
      id: `holder-${i}`,
      address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      amount: holdingAmount,
      percentage: percentage.toFixed(1),
      isCreator: i === 0,
    })
  }

  // Add the last holder with remaining supply
  holders.push({
    id: `holder-${count - 1}`,
    address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    amount: Math.floor((remainingSupply / 100) * totalSupply),
    percentage: remainingSupply.toFixed(1),
    isCreator: false,
  })

  return holders.sort((a, b) => Number.parseFloat(b.percentage) - Number.parseFloat(a.percentage))
}

// Generate random comments
const generateComments = (count: number) => {
  const commentTexts = [
    "This is really insightful content! Thanks for sharing your knowledge.",
    "I've been following your work for a while, and this is your best piece yet.",
    "Great analysis! The section on tokenomics is particularly valuable.",
    "Just bought some tokens. Looking forward to seeing how this project evolves.",
    "The market for this type of content is definitely growing. Smart move tokenizing it.",
    "I appreciate the depth of research that went into this. Very comprehensive.",
    "This helped me understand the concept much better. Well explained!",
    "Interesting perspective on the future of Web3 content. I'm bullish on your token.",
    "The quality of your content keeps improving. Glad I invested early.",
    "Just shared this with my network. Everyone should read this!",
    "The tokenomics model you've designed is really innovative.",
    "I have some questions about the liquidity pool. Can we discuss further?",
    "This is exactly the kind of content that should be tokenized. Value creation at its best.",
    "Your analysis of the market trends is spot on. Very accurate predictions.",
    "I'm impressed by how you've structured the token distribution. Very fair approach.",
  ]

  const usernames = [
    "web3enthusiast",
    "cryptotrader",
    "tokeninvestor",
    "blockchaindeveloper",
    "defiexplorer",
    "nftcollector",
    "ethmaximalist",
    "tokenomicsexpert",
    "onchainanalyst",
    "metaversecitizen",
    "daomember",
    "web3builder",
    "cryptoresearcher",
    "tokendesigner",
    "smartcontractdev",
  ]

  const userDisplayNames = [
    "Web3 Enthusiast",
    "Crypto Trader",
    "Token Investor",
    "Blockchain Developer",
    "DeFi Explorer",
    "NFT Collector",
    "ETH Maximalist",
    "Tokenomics Expert",
    "Onchain Analyst",
    "Metaverse Citizen",
    "DAO Member",
    "Web3 Builder",
    "Crypto Researcher",
    "Token Designer",
    "Smart Contract Dev",
  ]

  const comments = []

  for (let i = 0; i < count; i++) {
    const usernameIndex = Math.floor(Math.random() * usernames.length)
    const commentIndex = Math.floor(Math.random() * commentTexts.length)
    const date = randomRecentDate()

    comments.push({
      id: `comment-${i}-${Date.now()}`,
      user: usernames[usernameIndex],
      userName: userDisplayNames[usernameIndex],
      content: commentTexts[commentIndex],
      date,
      timeAgo: formatDistanceToNow(date, { addSuffix: true }),
      likes: Math.floor(Math.random() * 50),
    })
  }

  // Sort by date (newest first)
  return comments.sort((a, b) => b.date.getTime() - a.date.getTime())
}

// Generate content categories
export const contentCategories = [
  "Research",
  "Article",
  "Tutorial",
  "Analysis",
  "Guide",
  "Report",
  "Case Study",
  "Review",
  "Opinion",
  "Documentation",
]

// Generate tags
export const contentTags = [
  "blockchain",
  "web3",
  "defi",
  "nft",
  "dao",
  "tokenomics",
  "crypto",
  "ethereum",
  "bitcoin",
  "metaverse",
  "gaming",
  "finance",
  "technology",
  "investment",
  "trading",
  "development",
  "research",
  "analysis",
]

// Generate mock users
export const mockUsers = [
  {
    id: "user-1",
    username: "web3innovator",
    displayName: "Web3 Innovator",
    bio: "Blockchain researcher and Web3 content creator. Exploring the future of decentralized technologies.",
    avatar: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=600&width=1200",
    followers: 1245,
    following: 352,
    joinedDate: "January 2023",
    socialLinks: {
      twitter: "https://twitter.com/web3innovator",
      github: "https://github.com/web3innovator",
      website: "https://web3innovator.com",
    },
    isVerified: true,
  },
  {
    id: "user-2",
    username: "cryptoartist",
    displayName: "Crypto Artist",
    bio: "Digital artist exploring the intersection of art and blockchain technology. Creating tokenized art experiences.",
    avatar: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=600&width=1200",
    followers: 876,
    following: 231,
    joinedDate: "March 2023",
    socialLinks: {
      twitter: "https://twitter.com/cryptoartist",
      instagram: "https://instagram.com/cryptoartist",
      website: "https://cryptoartist.io",
    },
    isVerified: true,
  },
  {
    id: "user-3",
    username: "defiexpert",
    displayName: "DeFi Expert",
    bio: "DeFi researcher and educator. Breaking down complex financial protocols into understandable concepts.",
    avatar: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=600&width=1200",
    followers: 2134,
    following: 567,
    joinedDate: "November 2022",
    socialLinks: {
      twitter: "https://twitter.com/defiexpert",
      github: "https://github.com/defiexpert",
      website: "https://defiexplained.com",
    },
    isVerified: true,
  },
  {
    id: "user-4",
    username: "tokenomics",
    displayName: "Tokenomics Expert",
    bio: "Specializing in token economic design and sustainable crypto business models. Advisor to Web3 projects.",
    avatar: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=600&width=1200",
    followers: 1567,
    following: 423,
    joinedDate: "February 2023",
    socialLinks: {
      twitter: "https://twitter.com/tokenomics",
      github: "https://github.com/tokenomics",
      website: "https://tokenomicsdesign.com",
    },
    isVerified: false,
  },
  {
    id: "user-5",
    username: "nftanalyst",
    displayName: "NFT Analyst",
    bio: "Analyzing NFT markets and trends. Providing data-driven insights on collections and trading strategies.",
    avatar: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=600&width=1200",
    followers: 932,
    following: 287,
    joinedDate: "April 2023",
    socialLinks: {
      twitter: "https://twitter.com/nftanalyst",
      github: "https://github.com/nftanalyst",
      website: "https://nftanalytics.io",
    },
    isVerified: false,
  },
]

// Generate mock IP tokens
export const mockIpTokens = [
  {
    id: 1,
    title: "The Future of Web3 Content",
    slug: "future-of-web3-content",
    creator: mockUsers[0],
    symbol: "CONTENT",
    initialPrice: 0.0015,
    currentPrice: 0.002,
    marketCap: "$2,450",
    marketCapValue: 2450,
    volume: "$1,230",
    volumeValue: 1230,
    change: "+12.5%",
    changeValue: 12.5,
    holders: 141,
    totalSupply: 1000000,
    createdAt: new Date("2025-04-10T12:00:00Z"),
    category: "Research",
    tags: ["web3", "content", "tokenomics", "blockchain"],
    description:
      "An in-depth analysis of where Web3 content creation is headed and how creators can position themselves for success.",
    excerpt:
      "The landscape of content creation is rapidly evolving with the advent of Web3 technologies. Unlike traditional models where platforms own and monetize user-generated content, Web3 enables creators to maintain ownership and directly monetize their intellectual property.",
    content: `
      <h2>Introduction to Web3 Content Creation</h2>
      <p>The landscape of content creation is rapidly evolving with the advent of Web3 technologies. Unlike traditional models where platforms own and monetize user-generated content, Web3 enables creators to maintain ownership and directly monetize their intellectual property.</p>
      
      <h2>Key Trends in Web3 Content</h2>
      <p>Several trends are emerging in the Web3 content space:</p>
      <ul>
        <li>Tokenization of intellectual property</li>
        <li>Community-owned content platforms</li>
        <li>Direct creator-to-audience relationships</li>
        <li>Programmable royalties and revenue sharing</li>
        <li>Cross-platform content portability</li>
      </ul>
      
      <h2>Monetization Strategies</h2>
      <p>Web3 opens up new monetization avenues beyond traditional advertising and subscription models:</p>
      <ul>
        <li>Token-based access to premium content</li>
        <li>Fractional ownership of intellectual property</li>
        <li>Community funding through token sales</li>
        <li>Automated royalty distribution</li>
        <li>Liquidity pools for content tokens</li>
      </ul>
      
      <h2>Building Your Web3 Content Strategy</h2>
      <p>To succeed in the Web3 content ecosystem, creators should focus on:</p>
      <ul>
        <li>Creating high-quality, unique content</li>
        <li>Building an engaged community</li>
        <li>Designing sustainable tokenomics</li>
        <li>Leveraging multiple platforms while maintaining ownership</li>
        <li>Experimenting with new formats and engagement models</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>The future of Web3 content creation is promising, offering creators unprecedented ownership and monetization opportunities. By understanding the underlying technologies and embracing new models, creators can position themselves at the forefront of this revolution.</p>
    `,
    priceHistory: generatePriceHistory(30, 0.0015, 0.08, 0.005),
    volumeHistory: generateVolumeData(30, 1000, 0.5),
    transactions: generateTransactions(20, "CONTENT", 0.002),
    holders: generateHolders(12, 1000000),
    comments: generateComments(8),
    likes: 87,
    saves: 34,
    shares: 21,
    isPositive: true,
  },
  {
    id: 2,
    title: "Decentralized Art Collection",
    slug: "decentralized-art-collection",
    creator: mockUsers[1],
    symbol: "DART",
    initialPrice: 0.001,
    currentPrice: 0.0015,
    marketCap: "$1,850",
    marketCapValue: 1850,
    volume: "$920",
    volumeValue: 920,
    change: "+8.3%",
    changeValue: 8.3,
    holders: 85,
    totalSupply: 1200000,
    createdAt: new Date("2025-04-05T15:30:00Z"),
    category: "Art",
    tags: ["art", "nft", "collection", "digital"],
    description:
      "A curated collection of digital art pieces exploring themes of decentralization and digital ownership.",
    excerpt:
      "This collection brings together digital artworks that explore the concept of decentralization and what ownership means in the digital age. Each piece represents a unique perspective on how blockchain technology is reshaping our understanding of art.",
    content: `
      <h2>Introduction: Art in the Age of Decentralization</h2>
      <p>This collection brings together digital artworks that explore the concept of decentralization and what ownership means in the digital age. Each piece represents a unique perspective on how blockchain technology is reshaping our understanding of art.</p>
      
      <h2>The Collection</h2>
      <p>The Decentralized Art Collection features works from 12 different artists, each bringing their unique style and perspective:</p>
      <ul>
        <li>"Digital Sovereignty" - An exploration of self-ownership in the digital realm</li>
        <li>"Blockchain Horizons" - Visualizing the expanding landscape of decentralized networks</li>
        <li>"Token Genesis" - The birth and proliferation of digital value</li>
        <li>"Distributed Memories" - How shared ledgers create collective experiences</li>
        <li>"Autonomous Creations" - Art at the intersection of AI and blockchain</li>
      </ul>
      
      <h2>Artist Statements</h2>
      <p>Each artist has provided a statement about their contribution to the collection:</p>
      <blockquote>
        "My work explores the tension between centralized control and distributed ownership. In a world where digital assets can be infinitely copied, blockchain provides a new framework for scarcity and authenticity." - Digital Artist #1
      </blockquote>
      <blockquote>
        "I'm fascinated by how blockchain technology is creating new economic models for creators. My piece visualizes the flow of value directly from appreciators to artists without intermediaries." - Digital Artist #2
      </blockquote>
      
      <h2>The Technology Behind the Collection</h2>
      <p>This collection utilizes several innovative approaches to digital art ownership:</p>
      <ul>
        <li>On-chain storage of artwork metadata</li>
        <li>Programmable royalties for secondary sales</li>
        <li>Fractional ownership through tokenization</li>
        <li>Interactive elements that evolve based on token holder actions</li>
      </ul>
      
      <h2>Collecting and Participating</h2>
      <p>By acquiring tokens from this collection, you're not just collecting art – you're participating in a new model of creative economy where:</p>
      <ul>
        <li>Artists receive ongoing compensation for their work</li>
        <li>Collectors can support creators directly</li>
        <li>The community helps curate and promote the collection</li>
        <li>Ownership provides governance rights over future collection decisions</li>
      </ul>
    `,
    priceHistory: generatePriceHistory(30, 0.001, 0.07, 0.003),
    volumeHistory: generateVolumeData(30, 800, 0.4),
    transactions: generateTransactions(15, "DART", 0.0015),
    holders: generateHolders(10, 1200000),
    comments: generateComments(6),
    likes: 64,
    saves: 28,
    shares: 15,
    isPositive: true,
  },
  {
    id: 3,
    title: "DeFi Explained Simply",
    slug: "defi-explained-simply",
    creator: mockUsers[2],
    symbol: "DEFI",
    initialPrice: 0.002,
    currentPrice: 0.0025,
    marketCap: "$3,200",
    marketCapValue: 3200,
    volume: "$1,600",
    volumeValue: 1600,
    change: "+15.7%",
    changeValue: 15.7,
    holders: 156,
    totalSupply: 1500000,
    createdAt: new Date("2025-04-12T09:45:00Z"),
    category: "Education",
    tags: ["defi", "education", "finance", "crypto"],
    description: "Breaking down complex DeFi concepts into simple explanations that anyone can understand.",
    excerpt:
      "Decentralized Finance (DeFi) is revolutionizing the financial world, but its concepts can be difficult to grasp. This comprehensive guide breaks down complex DeFi mechanisms into simple, understandable explanations for beginners and experienced users alike.",
    content: `
      <h2>Introduction to DeFi</h2>
      <p>Decentralized Finance (DeFi) is revolutionizing the financial world, but its concepts can be difficult to grasp. This comprehensive guide breaks down complex DeFi mechanisms into simple, understandable explanations for beginners and experienced users alike.</p>
      
      <h2>The Building Blocks of DeFi</h2>
      <p>Before diving into specific protocols, it's important to understand the fundamental components that make DeFi possible:</p>
      <ul>
        <li><strong>Smart Contracts:</strong> Self-executing agreements with the terms written directly into code</li>
        <li><strong>Liquidity Pools:</strong> Collections of funds locked in smart contracts that facilitate trading</li>
        <li><strong>Automated Market Makers (AMMs):</strong> Algorithms that price assets based on mathematical formulas</li>
        <li><strong>Governance Tokens:</strong> Tokens that give holders voting rights over protocol decisions</li>
        <li><strong>Oracles:</strong> Services that connect blockchain smart contracts with real-world data</li>
      </ul>
      
      <h2>Key DeFi Categories Explained</h2>
      
      <h3>1. Lending and Borrowing</h3>
      <p>DeFi lending platforms allow users to lend their crypto assets to earn interest or borrow assets by providing collateral. Unlike traditional finance:</p>
      <ul>
        <li>No credit checks are required - everything is collateralized</li>
        <li>Interest rates adjust algorithmically based on supply and demand</li>
        <li>Loans can be taken out and repaid instantly, 24/7</li>
      </ul>
      
      <h3>2. Decentralized Exchanges (DEXs)</h3>
      <p>DEXs allow users to trade cryptocurrencies without intermediaries. Instead of matching buyers and sellers like traditional exchanges, most DEXs use liquidity pools and AMMs to facilitate trades.</p>
      
      <h3>3. Yield Farming</h3>
      <p>Yield farming involves moving assets between different protocols to maximize returns. Farmers typically:</p>
      <ul>
        <li>Provide liquidity to pools to earn trading fees</li>
        <li>Stake tokens to earn additional rewards</li>
        <li>Leverage their positions to amplify returns (with increased risk)</li>
      </ul>
      
      <h3>4. Synthetic Assets</h3>
      <p>Synthetic assets are tokenized derivatives that mimic the value of other assets (like stocks, commodities, or fiat currencies) without requiring ownership of the underlying asset.</p>
      
      <h2>DeFi Risks Simplified</h2>
      <p>While DeFi offers exciting opportunities, it's important to understand the risks:</p>
      <ul>
        <li><strong>Smart Contract Risk:</strong> Bugs or exploits in the code</li>
        <li><strong>Liquidation Risk:</strong> Collateral being sold when prices drop</li>
        <li><strong>Impermanent Loss:</strong> Loss of value when providing liquidity compared to simply holding</li>
        <li><strong>Oracle Failures:</strong> Incorrect price data leading to system failures</li>
      </ul>
      
      <h2>Getting Started with DeFi</h2>
      <p>If you're new to DeFi, here's a simple path to begin your journey:</p>
      <ol>
        <li>Set up a non-custodial wallet (like MetaMask)</li>
        <li>Start with small amounts to learn the mechanics</li>
        <li>Begin with established protocols that have stood the test of time</li>
        <li>Gradually explore more complex strategies as you gain confidence</li>
      </ol>
    `,
    priceHistory: generatePriceHistory(30, 0.002, 0.09, 0.006),
    volumeHistory: generateVolumeData(30, 1500, 0.6),
    transactions: generateTransactions(25, "DEFI", 0.0025),
    holders: generateHolders(15, 1500000),
    comments: generateComments(12),
    likes: 132,
    saves: 76,
    shares: 43,
    isPositive: true,
  },
  {
    id: 4,
    title: "Blockchain Gaming Guide",
    slug: "blockchain-gaming-guide",
    creator: mockUsers[0],
    symbol: "GAME",
    initialPrice: 0.0008,
    currentPrice: 0.001,
    marketCap: "$1,120",
    marketCapValue: 1120,
    volume: "$560",
    volumeValue: 560,
    change: "+5.2%",
    changeValue: 5.2,
    holders: 72,
    totalSupply: 2000000,
    createdAt: new Date("2025-04-08T14:15:00Z"),
    category: "Guide",
    tags: ["gaming", "blockchain", "play-to-earn", "nft"],
    description: "A comprehensive guide to blockchain gaming, play-to-earn models, and the future of gaming economies.",
    excerpt:
      "Blockchain technology is transforming the gaming industry by enabling true ownership of digital assets, play-to-earn mechanics, and player-driven economies. This guide explores the current landscape and future potential of blockchain gaming.",
    content: `
      <h2>Introduction to Blockchain Gaming</h2>
      <p>Blockchain technology is transforming the gaming industry by enabling true ownership of digital assets, play-to-earn mechanics, and player-driven economies. This guide explores the current landscape and future potential of blockchain gaming.</p>
      
      <h2>The Evolution of Gaming Economies</h2>
      <p>Gaming economies have evolved significantly over the years:</p>
      <ul>
        <li><strong>Traditional Gaming:</strong> Publishers control all assets, players have no real ownership</li>
        <li><strong>Free-to-Play:</strong> In-game purchases, but assets remain controlled by developers</li>
        <li><strong>Blockchain Gaming:</strong> Players truly own their assets and can trade them freely</li>
      </ul>
      
      <h2>Key Components of Blockchain Games</h2>
      
      <h3>1. NFTs in Gaming</h3>
      <p>Non-fungible tokens (NFTs) represent unique in-game assets such as:</p>
      <ul>
        <li>Characters and avatars</li>
        <li>Land and property</li>
        <li>Weapons and equipment</li>
        <li>Cosmetic items and skins</li>
        <li>Collectible cards and items</li>
      </ul>
      
      <h3>2. Play-to-Earn Models</h3>
      <p>Play-to-earn (P2E) games reward players with cryptocurrency or NFTs that have real-world value. Players can earn by:</p>
      <ul>
        <li>Completing quests and missions</li>
        <li>Winning competitions and tournaments</li>
        <li>Breeding or crafting valuable in-game assets</li>
        <li>Renting their assets to other players</li>
        <li>Contributing to the game ecosystem</li>
      </ul>
      
      <h3>3. Governance and DAOs</h3>
      <p>Many blockchain games implement decentralized autonomous organizations (DAOs) that allow players to vote on:</p>
      <ul>
        <li>Game mechanics and balance changes</li>
        <li>New features and content</li>
        <li>Economic parameters like token emission</li>
        <li>Revenue distribution and treasury management</li>
      </ul>
      
      <h2>Popular Blockchain Gaming Categories</h2>
      
      <h3>1. Metaverse Platforms</h3>
      <p>Virtual worlds where players can socialize, build, and monetize experiences.</p>
      
      <h3>2. Trading Card Games</h3>
      <p>Digital card games where cards are owned as NFTs and can be traded on open markets.</p>
      
      <h3>3. Strategy and RPG Games</h3>
      <p>Games where players collect, build, and battle with characters or assets they truly own.</p>
      
      <h3>4. Virtual Real Estate</h3>
      <p>Platforms focused on the ownership and development of digital land and properties.</p>
      
      <h2>Challenges and Future Outlook</h2>
      <p>While blockchain gaming shows tremendous promise, several challenges remain:</p>
      <ul>
        <li><strong>User Experience:</strong> Many games prioritize tokenomics over gameplay</li>
        <li><strong>Sustainability:</strong> Creating balanced economies that don't rely on constant new players</li>
        <li><strong>Regulatory Concerns:</strong> Potential classification as gambling in some jurisdictions</li>
        <li><strong>Environmental Impact:</strong> Energy consumption of certain blockchain networks</li>
      </ul>
      
      <p>Despite these challenges, the future looks bright with innovations in:</p>
      <ul>
        <li>Layer 2 solutions for faster, cheaper transactions</li>
        <li>Cross-game interoperability and shared universes</li>
        <li>More sophisticated economic designs and tokenomics</li>
        <li>AAA-quality games with blockchain integration</li>
      </ul>
    `,
    priceHistory: generatePriceHistory(30, 0.0008, 0.06, 0.002),
    volumeHistory: generateVolumeData(30, 500, 0.45),
    transactions: generateTransactions(18, "GAME", 0.001),
    holders: generateHolders(8, 2000000),
    comments: generateComments(5),
    likes: 47,
    saves: 19,
    shares: 12,
    isPositive: true,
  },
  {
    id: 5,
    title: "NFT Market Analysis",
    slug: "nft-market-analysis",
    creator: mockUsers[4],
    symbol: "NFTA",
    initialPrice: 0.0018,
    currentPrice: 0.0022,
    marketCap: "$2,780",
    marketCapValue: 2780,
    volume: "$1,390",
    volumeValue: 1390,
    change: "+9.8%",
    changeValue: 9.8,
    holders: 98,
    totalSupply: 1250000,
    createdAt: new Date("2025-04-03T11:20:00Z"),
    category: "Analysis",
    tags: ["nft", "market", "analysis", "trends"],
    description: "Data-driven analysis of NFT market trends, valuations, and future projections.",
    excerpt:
      "This comprehensive analysis examines the current state of the NFT market, identifying key trends, valuation metrics, and future growth opportunities based on on-chain data and market research.",
    content: `
      <h2>Introduction: The Evolving NFT Landscape</h2>
      <p>This comprehensive analysis examines the current state of the NFT market, identifying key trends, valuation metrics, and future growth opportunities based on on-chain data and market research.</p>
      
      <h2>Market Overview: Beyond the Hype Cycle</h2>
      <p>After the initial explosion of interest and subsequent cooling period, the NFT market has entered a more mature phase characterized by:</p>
      <ul>
        <li>More sustainable growth patterns</li>
        <li>Greater focus on utility and long-term value</li>
        <li>Increased institutional participation</li>
        <li>Expansion beyond art into multiple sectors</li>
      </ul>
      
      <h2>Key Market Segments Analysis</h2>
      
      <h3>1. Digital Art</h3>
      <p>The original NFT use case continues to evolve with:</p>
      <ul>
        <li>Established artists commanding premium prices</li>
        <li>Galleries and museums entering the space</li>
        <li>More sophisticated royalty and ownership structures</li>
        <li>Integration with physical art through phygital experiences</li>
      </ul>
      
      <h3>2. Gaming Assets</h3>
      <p>Gaming has emerged as one of the strongest use cases for NFTs:</p>
      <ul>
        <li>In-game items with cross-game utility</li>
        <li>Character NFTs with progression and history</li>
        <li>Land and venue NFTs generating passive income</li>
        <li>Esports and tournament prize NFTs</li>
      </ul>
      
      <h3>3. Virtual Real Estate</h3>
      <p>The metaverse land market has matured with:</p>
      <ul>
        <li>More realistic valuation models based on traffic and utility</li>
        <li>Development of rental and leasing markets</li>
        <li>Commercial development and advertising revenue models</li>
        <li>Integration with physical world locations and events</li>
      </ul>
      
      <h3>4. Membership and Access NFTs</h3>
      <p>One of the fastest-growing segments includes:</p>
      <ul>
        <li>Community membership and DAO participation</li>
        <li>Event access and exclusive experiences</li>
        <li>Content subscription and creator support</li>
        <li>Professional networking and credential verification</li>
      </ul>
      
      <h2>Valuation Metrics and Models</h2>
      <p>As the market matures, more sophisticated valuation approaches are emerging:</p>
      <ul>
        <li><strong>Rarity and Attributes:</strong> Quantitative scoring of trait rarity</li>
        <li><strong>Utility Value:</strong> Measurable benefits and use cases</li>
        <li><strong>Community Strength:</strong> Engagement metrics and growth patterns</li>
        <li><strong>Creator Premium:</strong> Brand value and creator reputation</li>
        <li><strong>Historical Significance:</strong> Cultural and market importance</li>
      </ul>
      
      <h2>On-Chain Data Insights</h2>
      <p>Analysis of transaction data reveals several important trends:</p>
      <ul>
        <li>Increasing concentration of value in blue-chip collections</li>
        <li>Growing percentage of NFTs held long-term (>1 year)</li>
        <li>Rising floor prices for utility-focused projects</li>
        <li>Correlation between creator engagement and collection value</li>
      </ul>
      
      <h2>Future Projections</h2>
      <p>Based on current data, we project the following developments in the NFT market:</p>
      <ul>
        <li>Increased integration with traditional finance and investment</li>
        <li>Growth of fractional ownership and NFT indexes</li>
        <li>Expansion of NFTs as identity and reputation systems</li>
        <li>Development of more sophisticated marketplace infrastructure</li>
        <li>Greater regulatory clarity and institutional adoption</li>
      </ul>
      
      <h2>Conclusion: Investment Opportunities</h2>
      <p>The most promising investment opportunities in the current NFT market include:</p>
      <ul>
        <li>Infrastructure and tooling projects</li>
        <li>Established collections with strong communities</li>
        <li>Utility-focused NFTs with proven use cases</li>
        <li>Cross-chain NFT platforms and bridges</li>
        <li>Real-world asset (RWA) tokenization projects</li>
      </ul>
    `,
    priceHistory: generatePriceHistory(30, 0.0018, 0.08, 0.004),
    volumeHistory: generateVolumeData(30, 1200, 0.55),
    transactions: generateTransactions(22, "NFTA", 0.0022),
    holders: generateHolders(11, 1250000),
    comments: generateComments(9),
    likes: 93,
    saves: 41,
    shares: 27,
    isPositive: true,
  },
  {
    id: 6,
    title: "Crypto Economics 101",
    slug: "crypto-economics-101",
    creator: mockUsers[3],
    symbol: "ECON",
    initialPrice: 0.0016,
    currentPrice: 0.0018,
    marketCap: "$1,950",
    marketCapValue: 1950,
    volume: "$975",
    volumeValue: 975,
    change: "+7.4%",
    changeValue: 7.4,
    holders: 83,
    totalSupply: 1100000,
    createdAt: new Date("2025-04-07T10:30:00Z"),
    category: "Education",
    tags: ["economics", "tokenomics", "crypto", "education"],
    description: "An educational series on cryptocurrency economics, token design, and sustainable tokenomics.",
    excerpt:
      "This educational series provides a foundational understanding of cryptocurrency economics, token design principles, and sustainable tokenomics models. Learn how to analyze and create effective token economies.",
    content: `
      <h2>Introduction to Crypto Economics</h2>
      <p>This educational series provides a foundational understanding of cryptocurrency economics, token design principles, and sustainable tokenomics models. Learn how to analyze and create effective token economies.</p>
      
      <h2>Part 1: Fundamentals of Token Economics</h2>
      
      <h3>What is Tokenomics?</h3>
      <p>Tokenomics is the study of the economic systems governing cryptocurrencies and digital tokens. It encompasses:</p>
      <ul>
        <li>Token supply and distribution mechanisms</li>
        <li>Incentive structures and game theory</li>
        <li>Value accrual and capture mechanisms</li>
        <li>Governance and decision-making processes</li>
        <li>Market dynamics and price discovery</li>
      </ul>
      
      <h3>Key Economic Principles in Crypto</h3>
      <p>Several traditional economic principles apply to crypto with unique adaptations:</p>
      <ul>
        <li><strong>Scarcity:</strong> Fixed or predictable supply schedules</li>
        <li><strong>Utility:</strong> Functional use cases driving demand</li>
        <li><strong>Network Effects:</strong> Value increasing with user adoption</li>
        <li><strong>Velocity:</strong> The rate at which tokens circulate</li>
        <li><strong>Liquidity:</strong> Ease of converting to other assets</li>
      </ul>
      
      <h2>Part 2: Token Design Patterns</h2>
      
      <h3>Common Token Types</h3>
      <p>Different token designs serve different purposes in the ecosystem:</p>
      <ul>
        <li><strong>Payment Tokens:</strong> Used primarily as a medium of exchange</li>
        <li><strong>Utility Tokens:</strong> Provide access to specific products or services</li>
        <li><strong>Governance Tokens:</strong> Grant voting rights in protocol decisions</li>
        <li><strong>Security Tokens:</strong> Represent ownership in an asset or enterprise</li>
        <li><strong>Non-Fungible Tokens:</strong> Represent unique assets or rights</li>
        <li><strong>Stablecoins:</strong> Maintain a stable value relative to a reference asset</li>
      </ul>
      
      <h3>Supply Mechanisms</h3>
      <p>Token supply can be managed through various mechanisms:</p>
      <ul>
        <li><strong>Fixed Supply:</strong> A capped maximum supply (e.g., Bitcoin)</li>
        <li><strong>Inflationary:</strong> Continuous issuance at a predetermined rate</li>
        <li><strong>Deflationary:</strong> Reduction in supply through burning or locking</li>
        <li><strong>Elastic Supply:</strong> Algorithmic adjustment based on demand</li>
        <li><strong>Rebase Mechanisms:</strong> Adjustment of token balances across all holders</li>
      </ul>
      
      <h2>Part 3: Sustainable Tokenomics Models</h2>
      
      <h3>Value Accrual Mechanisms</h3>
      <p>For a token to maintain long-term value, it needs mechanisms to capture value:</p>
      <ul>
        <li><strong>Fee Sharing:</strong> Protocol fees distributed to token holders</li>
        <li><strong>Buyback and Burn:</strong> Using revenue to reduce circulating supply</li>
        <li><strong>Staking Rewards:</strong> Incentives for locking up tokens</li>
        <li><strong>Governance Rights:</strong> Value from decision-making authority</li>
        <li><strong>Resource Rights:</strong> Access to scarce computational resources</li>
      </ul>
      
      <h3>Balancing Stakeholder Incentives</h3>
      <p>Sustainable tokenomics must align incentives across different participants:</p>
      <ul>
        <li><strong>Users:</strong> Affordable access to services</li>
        <li><strong>Developers:</strong> Rewards for building and maintaining</li>
        <li><strong>Investors:</strong> Long-term value appreciation</li>
        <li><strong>Network Operators:</strong> Compensation for securing the network</li>
        <li><strong>Community:</strong> Fair governance and distribution</li>
      </ul>
      
      <h2>Part 4: Analyzing Token Models</h2>
      
      <h3>Key Metrics to Evaluate</h3>
      <p>When analyzing a token's economic model, consider these factors:</p>
      <ul>
        <li><strong>Token Distribution:</strong> Initial allocation and vesting schedules</li>
        <li><strong>Emission Schedule:</strong> Rate of new token creation</li>
        <li><strong>Token Utility:</strong> Necessary use cases driving demand</li>
        <li><strong>Value Capture:</strong> Mechanisms linking protocol success to token value</li>
        <li><strong>Token Velocity:</strong> How quickly tokens change hands</li>
        <li><strong>Governance Structure:</strong> Decision-making processes and rights</li>
      </ul>
      
      <h3>Red Flags in Tokenomics</h3>
      <p>Watch out for these warning signs in token economic designs:</p>
      <ul>
        <li>Excessive allocation to team/investors with short vesting periods</li>
        <li>Unsustainable emission rates or yield mechanisms</li>
        <li>Lack of clear utility or forced token usage</li>
        <li>Misaligned incentives between stakeholders</li>
        <li>Overly complex mechanisms that mask fundamental issues</li>
      </ul>
      
      <h2>Conclusion: Designing for Longevity</h2>
      <p>The most successful token economies share these characteristics:</p>
      <ul>
        <li>Clear and necessary utility within the ecosystem</li>
        <li>Fair initial distribution and transparent emission</li>
        <li>Strong value accrual mechanisms</li>
        <li>Aligned incentives across all stakeholders</li>
        <li>Adaptability through effective governance</li>
      </ul>
    `,
    priceHistory: generatePriceHistory(30, 0.0016, 0.06, 0.002),
    volumeHistory: generateVolumeData(30, 900, 0.4),
    transactions: generateTransactions(17, "ECON", 0.0018),
    holders: generateHolders(9, 1100000),
    comments: generateComments(7),
    likes: 58,
    saves: 32,
    shares: 19,
    isPositive: true,
  },
]

// Generate mock notifications
export const mockNotifications = [
  {
    id: 1,
    type: "transaction",
    title: "Purchase Successful",
    message: "You successfully purchased 25 CONTENT tokens",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    title: "New Comment",
    message: "Crypto Enthusiast commented on your IP Coin",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "price",
    title: "Price Alert",
    message: "DEFI token is up 15% in the last 24 hours",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "system",
    title: "Welcome to IP COIN",
    message: "Thank you for joining the IP COIN platform",
    time: "3 days ago",
    read: true,
  },
  {
    id: 5,
    type: "follower",
    title: "New Follower",
    message: "Web3 Innovator is now following you",
    time: "1 week ago",
    read: true,
  },
]

// Generate mock user portfolio
export const mockUserPortfolio = {
  totalValue: "$4,230.50",
  totalValueChange: "+12.5%",
  tokens: [
    {
      id: 1,
      name: "Content Creation Guide",
      symbol: "CONTENT",
      amount: 1250,
      value: "$2,500",
      price: "0.002 ETH",
      change: "+12.5%",
      isPositive: true,
    },
    {
      id: 3,
      name: "DeFi Explained Simply",
      symbol: "DEFI",
      amount: 500,
      value: "$1,250",
      price: "0.0025 ETH",
      change: "+15.7%",
      isPositive: true,
    },
    {
      id: 5,
      name: "NFT Market Analysis",
      symbol: "NFTA",
      amount: 218,
      value: "$480.50",
      price: "0.0022 ETH",
      change: "+9.8%",
      isPositive: true,
    },
  ],
  recentActivity: [
    {
      id: 1,
      type: "buy",
      token: "CONTENT",
      amount: "0.5 ETH",
      tokens: "250 CONTENT",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "sell",
      token: "DART",
      amount: "0.3 ETH",
      tokens: "200 DART",
      time: "1 day ago",
    },
    {
      id: 3,
      type: "buy",
      token: "DEFI",
      amount: "0.75 ETH",
      tokens: "300 DEFI",
      time: "3 days ago",
    },
    {
      id: 4,
      type: "buy",
      token: "NFTA",
      amount: "0.48 ETH",
      tokens: "218 NFTA",
      time: "1 week ago",
    },
  ],
}

// Generate trending topics
export const trendingTopics = [
  "web3",
  "defi",
  "nft",
  "tokenization",
  "dao",
  "metaverse",
  "blockchain",
  "crypto",
  "ethereum",
  "bitcoin",
]

// Generate mock search results
export const generateSearchResults = (query: string) => {
  // Filter tokens based on query
  const filteredTokens = mockIpTokens.filter(
    (token) =>
      token.title.toLowerCase().includes(query.toLowerCase()) ||
      token.symbol.toLowerCase().includes(query.toLowerCase()) ||
      token.description.toLowerCase().includes(query.toLowerCase()) ||
      token.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
  )

  // Filter users based on query
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.displayName.toLowerCase().includes(query.toLowerCase()) ||
      user.bio.toLowerCase().includes(query.toLowerCase()),
  )

  return {
    tokens: filteredTokens,
    users: filteredUsers,
    tags: contentTags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase())),
  }
}

// Helper function to format currency
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Helper function to format compact number
export const formatCompactNumber = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value)
}

// Helper function to format percentage
export const formatPercentage = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

// Export all mock data
export const mockData = {
  users: mockUsers,
  ipTokens: mockIpTokens,
  notifications: mockNotifications,
  userPortfolio: mockUserPortfolio,
  trendingTopics,
  contentCategories,
  contentTags,
  generateSearchResults,
  formatCurrency,
  formatCompactNumber,
  formatPercentage,
}

export default mockData
