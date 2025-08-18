"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRight, User, Calendar, Shield, FileText, CheckCircle } from "lucide-react"

interface OwnershipRecord {
  event: string
  from: string
  to: string
  date: string
  transactionHash?: string
  memo?: string
  verified: boolean
}

interface OwnershipProvenanceProps {
  assetId: string
  assetName: string
  creationDate: string
  creator: string
  history: OwnershipRecord[]
}

export function OwnershipProvenance({ assetId, assetName, creationDate, creator, history }: OwnershipProvenanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Ownership Provenance
        </CardTitle>
        <p className="text-sm text-muted-foreground">Complete ownership history and chain of custody for {assetName}</p>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {/* Current ownership chain */}
            {history.map((record, index) => (
              <div key={index} className="relative">
                {/* Connection line */}
                {index < history.length - 1 && <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />}

                <div className="flex items-start gap-4">
                  {/* Event icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>

                  {/* Event details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{record.event}</h3>
                      <div className="flex items-center gap-2">
                        {record.verified && (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {record.date}
                        </Badge>
                      </div>
                    </div>

                    {/* Transfer details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">From</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{record.from.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{record.from}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">To</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{record.to.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{record.to}</span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction hash */}
                    {record.transactionHash && (
                      <div className="text-xs text-muted-foreground">
                        <span>Transaction: </span>
                        <code className="bg-muted px-1 py-0.5 rounded">{record.transactionHash}</code>
                      </div>
                    )}

                    {/* Memo */}
                    {record.memo && <div className="text-sm italic text-muted-foreground">"{record.memo}"</div>}
                  </div>
                </div>
              </div>
            ))}

            {/* Original creation */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Asset Created</h3>
                    <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      <FileText className="h-3 w-3 mr-1" />
                      Genesis
                    </Badge>
                  </div>

                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{creator.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{creator}</span>
                      <Badge variant="secondary" className="text-xs">
                        Original Creator
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Created on {creationDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Provenance summary */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Provenance Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Transfers</span>
              <p className="font-medium">{history.length}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Creation Date</span>
              <p className="font-medium">{creationDate}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Asset Age</span>
              <p className="font-medium">
                {Math.floor((new Date().getTime() - new Date(creationDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Verification</span>
              <p className="font-medium text-green-600">100% Verified</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
