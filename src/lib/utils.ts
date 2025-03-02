import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to shorten address
export const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper function to convert hex to decimal and format it
export const formatAmount = (hex: string) => {
  const decimal = parseInt(hex, 16);
  return decimal.toString();
};

// Helper function to truncate long strings
export const truncateString = (str: string, maxLength: number = 30) => {
  if (str.length <= maxLength) return str
  return `${str.substring(0, maxLength)}...`
}