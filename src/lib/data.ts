export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  verified: boolean;
}

export interface Publication {
  id: string;
  title: string;
  content: string;
  author: Author;
  date: string;
  format: string;
  likes: number;
  hearts: number;
  starkz: number;
  crowns: number;
  comments: number;
  tags: string[];
  categories: string[];
  excerpt: string;
  media: string;
  slug: string;
  collection: string;
}

export const authors: Author[] = [
  {
    id: '1',
    name: 'Pedro',
    avatar: 'https://github.com/shadcn.png',
    bio: 'Cryptography expert',
    verified: true,
  },
  {
    id: '2',
    name: 'Alice',
    avatar: 'https://github.com/shadcn.png',
    bio: 'Blockchain researcher',
    verified: true,
  },
  {
    id: '3',
    name: 'Rodrigo',
    avatar: 'https://github.com/shadcn.png',
    bio: 'Full-stack developer',
    verified: true,
  },
];

export const publications: Publication[] = [
  {
    id: '1',
    title: 'IP Tokenization: Empowering the New Economy at the Intersection of AI',
    content: 'In the burgeoning era of artificial intelligence (AI), the concept of value is undergoing a profound transformation. Intellectual property (IP) has emerged as the cornerstone of the intelligence economy, representing a scarce and invaluable asset. As AI continues to advance, the intersection of AI and blockchain technology offers unprecedented opportunities to create a global market that empowers creators and drives the new economy. Intellectual property has always been a crucial driver of innovation and economic growth. However, in the age of AI, its importance has reached new heights. IP encompasses a wide range of creations, including inventions, artistic works, designs, and proprietary algorithms. These assets are not only scarce but also hold immense value due to their unique and irreplaceable nature. The scarcity of IP makes it a precious commodity in the digital economy, driving competition and fostering innovation.',
    author: authors[0],
    date: '2025-01-15T10:00:00Z',
    format: '10 min read',
    likes: 120,
    hearts: 50,
    starkz: 30,
    crowns: 5,
    comments: 2,
    tags: ['Blockchain', 'IP', 'Tokenization', 'AI'],
    categories: ['Blockchain'],
    excerpt: 'IP Tokenization: Empowering the New Economy at the Intersection of AI.',
    media: '/post-AI-IP.png',
    slug: 'ip-tokenization-empowering-the-new-economy-at-the-intersection-of-ai',
    collection: '1',
  },
  {
    id: '2',
    title: 'The Crucial Role of Blockchain and Zero-Knowledge Proofs for Protecting Intellectual Property in the AI Era',
    content: 'In today’s rapidly evolving technological landscape, the advent of artificial intelligence (AI) has revolutionized numerous industries, fostering unprecedented growth and innovation. However, this era of rapid advancement brings with it a host of challenges, particularly in the realm of intellectual property (IP) protection. Traditional methods of safeguarding IP are increasingly proving inadequate, necessitating innovative solutions. Enter blockchain technology and zero-knowledge proofs (ZKPs), two powerful tools that hold the potential to transform IP protection in the AI era. Artificial intelligence has become a cornerstone of modern innovation, driving breakthroughs in fields ranging from healthcare and finance to entertainment and manufacturing. However, the very nature of AI, with its ability to analyze vast amounts of data and generate new content, poses significant challenges for IP protection. Traditional IP protection mechanisms, such as patents, copyrights, and trademarks, were designed for a pre-digital era and often struggle to keep pace with the rapid dissemination and replication of information in the digital age.',
    author: authors[1],
    date: '2025-01-20T14:30:00Z',
    format: 'Article',
    likes: 95,
    hearts: 40,
    starkz: 20,
    crowns: 3,
    comments: 18,
    tags: ['Blockchain', 'IP', 'Tokenization', 'AI'],
    categories: ['Tokenization'],
    excerpt: 'The Crucial Role of Blockchain and Zero-Knowledge Proofs for Protecting Intellectual Property in the AI Era',
    slug: 'the-crucial-role-of-blockchain-and-zero-knowledge-proofs-for-protecting-intellectual-property-in-the-ai-era',
    media: '/post-new-economy.png',
    collection: '1',
  },
  {
    id: '3',
    title: 'Programmable IP: Tokenizing Intelligence on the Integrity Web',
    content: 'The rapid evolution of the digital landscape has given birth to new paradigms and technologies that are reshaping the way we interact with information and assets. Among these, the concepts of programmable intellectual property (IP) and the Integrity Web stand out as transformative forces that promise to revolutionize the management, distribution, and utilization of intelligence. This publication explores how programmable IP will tokenize intelligence on the Integrity Web, ushering in a new era of transparency, security, and innovation. Programmable IP refers to intellectual property that is embedded with smart contracts, allowing for automated and programmable actions based on predefined conditions. This concept harnesses the power of blockchain technology to tokenize IP assets, enabling them to be traded, licensed, and monetized with unprecedented precision and flexibility. The Integrity Web is an emerging digital ecosystem built on the principles of trust, transparency, and authenticity. It leverages blockchain technology to create a decentralized and immutable ledger of transactions, ensuring that information and assets remain secure and verifiable. In this context, programmable IP represents a groundbreaking innovation that enables the creation, management, and distribution of intellectual property in a highly efficient and secure manner. Tokenizing intelligence on the Integrity Web represents a paradigm shift in how we conceptualize and manage intellectual property. By transforming intelligence into programmable and tradable tokens, we can unlock new avenues for collaboration, innovation, and value creation. Programmable IP and the Integrity Web represent a transformative vision for the future of intellectual property and intelligence. By tokenizing IP assets and leveraging the power of blockchain technology, we can create a more transparent, secure, and innovative digital ecosystem. As we move forward, it is essential to address the challenges and embrace the opportunities presented by these technologies to unlock their full potential and drive the next wave of digital innovation.',
    author: authors[2],
    date: '2025-01-25T09:15:00Z',
    format: '12 min read',
    likes: 150,
    hearts: 70,
    starkz: 40,
    crowns: 8,
    comments: 30,
    tags: ['Blockchain', 'IP', 'Tokenization', 'Integrity Web'],
    categories: ['Blockchain'],
    excerpt: 'Programmable IP: Tokenizing Intelligence on the Integrity Web.',
    media: '/post-Programmable-IP.png',
    slug: 'programmable-ip-tokenizing-intelligence-on-the-integrity-web',
    collection: '1',
  },
];

//export const categories = Array.from(new Set(publications.map(pub => pub.categories)));
export const allTags = Array.from(new Set(publications.flatMap(pub => pub.tags)));

export const collections = [
  "Cryptography",
  "Blockchain",
  "Rust Programming",
  "Zero-Knowledge",
  "Development",
  "Decentralized Finance",
  "Smart Contract",
  "Starknet",
]

export function getPublicationById(id: string): Publication | undefined {
  return publications.find(pub => pub.id === id);
}

export function getCommentsByPublicationId(publicationId: string): Comment[] {
  // This is a mock function. In a real application, you would fetch comments from a database.
  return [
    { id: '1', author: 'Robert', content: 'Great article!', createdAt: '2025-01-12T10:00:00Z' },
    { id: '2', author: 'David', content: 'Very informative, thanks!', createdAt: '2025-01-16T11:30:00Z' },
  ];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}




export interface Category {
  id: string
  name: string
}

export const categories: Category[] = [
  { id: "1", name: "Blockchain" },
  { id: "2", name: "Artificial Intelligence" },
  { id: "3", name: "Cryptography" },
  { id: "4", name: "Data Science" },
  { id: "5", name: "Web Development" },
  { id: "6", name: "Machine Learning" },
  { id: "7", name: "Cybersecurity" },
  { id: "8", name: "Quantum Computing" },
]

