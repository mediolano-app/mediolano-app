import type { User, Item, Collection, Offer, Deal, Activity } from "./types"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export const user: User = {
  id: "0x1234567890123456789012345678901234567890",
  username: "User Name",
  avatar: "/background.jpg",
  banner: "/background.jpg",
  bio: "Creating and selling unique digital assets on the blockchain",
  registrationDate: "2025-01-15",
  creations: 12,
  collections: 2,
  socialLinks: [
    { icon: Twitter, url: "https://twitter.com/cryptocreator" },
    { icon: Instagram, url: "https://instagram.com/cryptocreator" },
    { icon: Facebook, url: "https://facebook.com/cryptocreator" },
    { icon: Linkedin, url: "https://linkedin.com/in/cryptocreator" },
  ],
}

export const featuredItems: Item[] = [
  {
    id: "1",
    name: "Quantum Thought",
    image: "/background.jpg",
    price: 2.5,
  },
  {
    id: "2",
    name: "Digital Dreams",
    image: "/background.jpg",
    price: 1.8,
  },
  {
    id: "3",
    name: "Neon Nostalgia",
    image: "/background.jpg",
    price: 3.2,
  },
  {
    id: "4",
    name: "Cyberpunk Vision",
    image: "/background.jpg",
    price: 2.1,
  },
  {
    id: "5",
    name: "Ethereal Whispers",
    image: "/background.jpg",
    price: 1.5,
  },
  {
    id: "6",
    name: "Galactic Harmony",
    image: "/background.jpg",
    price: 4.0,
  },
]

export const collections: Collection[] = [
  {
    id: "1",
    name: "Abstract Minds",
    image: "/background.jpg",
    itemCount: 10,
  },
  {
    id: "2",
    name: "Future Visions",
    image: "/background.jpg",
    itemCount: 15,
  },
  {
    id: "3",
    name: "Retro Revival",
    image: "/background.jpg",
    itemCount: 8,
  },
  {
    id: "4",
    name: "Digital Dreamscapes",
    image: "/background.jpg",
    itemCount: 12,
  },
  {
    id: "5",
    name: "Crypto Creatures",
    image: "/background.jpg",
    itemCount: 20,
  },
  {
    id: "6",
    name: "Pixel Perfection",
    image: "/background.jpg",
    itemCount: 18,
  },
]

export const items: Item[] = [
  {
    id: "1",
    name: "Ethereal Whisper",
    image: "/background.jpg",
    price: 1.2,
  },
  {
    id: "2",
    name: "Cosmic Harmony",
    image: "/background.jpg",
    price: 3.0,
  },
  {
    id: "3",
    name: "Digital Dystopia",
    image: "/background.jpg",
    price: 2.7,
  },
  {
    id: "4",
    name: "Neon Nights",
    image: "/background.jpg",
    price: 1.9,
  },
  {
    id: "5",
    name: "Quantum Quandary",
    image: "/background.jpg",
    price: 3.5,
  },
  {
    id: "6",
    name: "Virtual Vortex",
    image: "/background.jpg",
    price: 2.2,
  },
]

export const offers: Offer[] = [
  {
    id: "1",
    item: "Quantum Thought",
    price: 2.3,
    from: "0xabcd...",
    expires: "2023-12-31",
  },
  {
    id: "2",
    item: "Digital Dreams",
    price: 1.7,
    from: "0xefgh...",
    expires: "2023-12-25",
  },
]

export const deals: Deal[] = [
  {
    id: "1",
    item: "Ethereal Whisper",
    price: 1.2,
    buyer: "0x1234...",
    date: "2023-11-20",
  },
  {
    id: "2",
    item: "Cosmic Harmony",
    price: 2.8,
    buyer: "0x5678...",
    date: "2023-11-18",
  },
]

export const activities: Activity[] = [
  {
    id: "1",
    type: "Sale",
    item: "Quantum Thought",
    price: 2.5,
    from: "0x1234...",
    to: "0xabcd...",
    date: "2023-11-22",
  },
  {
    id: "2",
    type: "Offer",
    item: "Digital Dreams",
    price: 1.7,
    from: "0xefgh...",
    to: "0x1234...",
    date: "2023-11-21",
  },
]

