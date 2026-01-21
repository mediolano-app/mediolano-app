"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, Calendar, User, FileText, CheckCircle, Award, ExternalLink } from "lucide-react"

interface OwnershipProvenanceProps {
  assetId: string
  assetName: string
  creationDate: string
  creator: string
  history: Array<{
    event: string
    from: string
    to: string
    date: string
    transactionHash?: string
    memo?: string
    verified: boolean
    type: string
  }>
}

export function OwnershipProvenance({ assetId, assetName, creationDate, creator, history }: OwnershipProvenanceProps) {
  const handleViewTransaction = (hash: string) => {
    console.log("Opening transaction:", hash)
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Ownership Provenance
        </h2>

        <div className="space-y-6">
          {/* Provenance Timeline */}
          <div className="relative">
            {history.map((record, index) => (
              <div key={index} className="relative flex items-start gap-4 pb-6">
                {/* Timeline line */}
                {index < history.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-primary to-primary/30" />
                )}

                {/* Event icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                  {record.type === "transfer" ? (
                    <User className="h-5 w-5 text-primary" />
                  ) : (
                    <FileText className="h-5 w-5 text-primary" />
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 min-w-0">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{record.event}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {record.date}
                        </Badge>
                        {record.verified && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
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

                    {record.transactionHash && (
                      <div className="text-xs text-muted-foreground mb-2">
                        <span>Transaction: </span>
                        <code className="bg-muted px-2 py-1 rounded font-mono">{record.transactionHash}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-6 w-6 p-0"
                          onClick={() => handleViewTransaction(record.transactionHash!)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {record.memo && (
                      <div className="text-sm italic text-muted-foreground bg-muted/50 p-2 rounded">
                        "{record.memo}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Genesis Event */}
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Asset Created</h3>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <Award className="h-3 w-3 mr-1" />
                      Genesis
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{creator.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">{creator}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Original Creator
                      </Badge>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    Created on {creationDate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Provenance Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{history.length}</p>
              <p className="text-xs text-muted-foreground">Total Events</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {Math.floor((new Date().getTime() - new Date(creationDate).getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-xs text-muted-foreground">Days Old</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">100%</p>
              <p className="text-xs text-muted-foreground">Verified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">1</p>
              <p className="text-xs text-muted-foreground">Current Owner</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
