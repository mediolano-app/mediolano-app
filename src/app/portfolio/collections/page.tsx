import { Metadata } from "next";
import CollectionsClientPage from "./client-page";

export const metadata: Metadata = {
    title: "My Collections | IP Portfolio",
    description: "Manage your created IP collections and assets on Mediolano.",
};

export default function CollectionsPage() {
    return <CollectionsClientPage />;
}
