import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
};

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  // Check if the date is today
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  // Check if the date is yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // If within the last 7 days, show the day name
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  if (date > oneWeekAgo) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  // Otherwise, show the date
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function normalizeStarknetAddress(address: string): string {
  return `0x${BigInt(address).toString(16).toLowerCase()}`;
}
export function toHexString(value: string | number | bigint): string {
  try {
    const num = BigInt(value);
    return "0x" + num.toString(16);
  } catch {
    throw new Error(`Invalid input for hex conversion: ${value}`);
  }
}

export function toEpochTime(date: string | Date): number {
  const d = typeof date === "string" ? new Date(date) : date;
  return Math.floor(d.getTime() / 1000);
}
