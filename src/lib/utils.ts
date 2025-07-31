import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to shorten address
export const shortenAddress = (address: string) => {
  if (!address || address === "N/A" || address.length < 10) return address || "N/A";
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

export function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 300
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Max retry attempts reached");
}

export async function fetchInBatches<T>(
  tasks: (() => Promise<T>)[],
  batchSize = 5,
  delayMs = 300
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map((t) => t()));

    for (const res of batchResults) {
      if (res.status === "fulfilled") {
        results.push(res.value);
      } else {
        console.warn("Data fetch failed:", res.reason);
      }
    }

    if (i + batchSize < tasks.length) {
      await delay(delayMs);
    }
  }

  return results;
}

export async function fetchOneByOne<T>(
  tasks: (() => Promise<T>)[],
  delayMs = 500
): Promise<T[]> {
  const results: T[] = [];

  for (const task of tasks) {
    try {
      const result = await task();
      results.push(result);
    } catch (err) {
      console.warn("Fetch failed:", err);
    }

    if (delayMs > 0) {
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  return results;
}

