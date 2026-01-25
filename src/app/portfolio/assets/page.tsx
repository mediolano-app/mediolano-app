import { Metadata } from "next";
import AssetsClientPage from "./client-page";

export const metadata: Metadata = {
    title: "My Assets | IP Portfolio",
    description: "View and manage your owned IP assets and NFTs on Mediolano.",
};

export default function AssetsPage() {
    return <AssetsClientPage />;
}
