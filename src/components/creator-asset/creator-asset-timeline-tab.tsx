"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Palette,
  ArrowRightLeft,
  DollarSign,
  FileText,
  Coins,
  ExternalLink,
} from "lucide-react";
import { useMyTransferEventsForTokenId } from "@/hooks/useEvents";
import { toHexString } from "@/lib/utils";

const ZERO_ADDRESS = "0x0";

const eventIcons = {
  creation: Palette,
  transfer: ArrowRightLeft,
  sale: DollarSign,
  licensing: FileText,
  royalty: Coins,
};

const eventColors = {
  creation: "bg-green-100 text-green-800 border-green-200",
  transfer: "bg-blue-100 text-blue-800 border-blue-200",
  sale: "bg-purple-100 text-purple-800 border-purple-200",
  licensing: "bg-orange-100 text-orange-800 border-orange-200",
  royalty: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

export function AssetTimelineTab({ tokenId }: { tokenId: string }) {
  const { filteredEvents, isLoading, error } =
    useMyTransferEventsForTokenId(tokenId);

  const timelineEvents = filteredEvents
    ?.filter((event) => {
      const keys = event.keys || [];
      const eventTokenId = keys?.[3];
      return eventTokenId === toHexString(tokenId);
    })
    .map((event, i) => {
      const keys = event.keys || [];
      const from = keys[1];
      const to = keys[2];
      const type = from === ZERO_ADDRESS ? "creation" : "transfer";

      return {
        id: `evt${i + 1}`,
        type,
        from,
        to,
        tokenId: keys[3],
        transactionHash: event.transaction_hash,
        blockNumber: event.block_number,
        // timestamp: event.block_timestamp,
        details:
          type === "creation"
            ? "Asset minted by creator"
            : "Transferred to new owner",
      };
    });

  if (isLoading) return <p></p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!timelineEvents || timelineEvents.length === 0)
    return <p>No events for this token.</p>;

  return (
    <div className="space-y-4 pt-4">
      <h3 className="text-xl font-semibold">Asset Timeline History</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {timelineEvents.map((event) => {
            // @ts-expect-error expected
            const Icon = eventIcons[event.type];
            // @ts-expect-error expected
            const colorClass = eventColors[event.type];

            return (
              <div key={event.id} className="relative flex items-start gap-4">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-background ${colorClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Event content */}
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={colorClass}>
                            {event.type.charAt(0).toUpperCase() +
                              event.type.slice(1)}
                          </Badge>
                          {/* <span className="text-sm text-muted-foreground">
                            {format(
                              new Date(event.timestamp),
                              "MMM dd, yyyy HH:mm"
                            )}
                          </span> */}
                        </div>

                        <p className="text-sm font-medium">{event.details}</p>

                        <div className="space-y-1 text-xs text-muted-foreground">
                          {event.from && (
                            <div>
                              From:{" "}
                              <code className="bg-muted px-1 rounded">
                                {event.from}
                              </code>
                            </div>
                          )}
                          {event.to && (
                            <div>
                              To:{" "}
                              <code className="bg-muted px-1 rounded">
                                {event.to}
                              </code>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            Block:{" "}
                            <code className="bg-muted px-1 rounded">
                              {event.blockNumber}
                            </code>
                            <ExternalLink className="h-3 w-3 cursor-pointer hover:text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
