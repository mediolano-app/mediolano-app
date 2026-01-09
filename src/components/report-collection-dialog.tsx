"use client"

import { ReportAssetDialog } from "@/components/report-asset-dialog"

interface ReportCollectionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    collectionId: string
    collectionName: string
    collectionOwner?: string
}

export function ReportCollectionDialog({
    open,
    onOpenChange,
    collectionId,
    collectionName,
    collectionOwner,
}: ReportCollectionDialogProps) {
    return (
        <ReportAssetDialog
            open={open}
            onOpenChange={onOpenChange}
            contentId={collectionId}
            contentName={collectionName}
            contentCreator={collectionOwner}
            contentType="collection"
        />
    )
}
