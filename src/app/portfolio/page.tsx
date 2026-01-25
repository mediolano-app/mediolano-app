import { Metadata } from "next";
import PortfolioClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Portfolio | IP Creator",
  description: "Your central hub for managing IP collections and assets on Mediolano.",
};

export default function PortfolioPage() {
  return <PortfolioClientPage />;
}
