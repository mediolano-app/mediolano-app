"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, FileText, Gauge } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { NFTCardProps } from "./types";

export const CreatorNFTCard: React.FC<NFTCardProps> = ({
  tokenId,
  metadata,
}) => {
  if (!metadata) return null;

  function truncateString(input: string, maxLength: number): string {
    return input.length > maxLength
      ? input.substring(0, maxLength) + "..."
      : input;
  }

  const isImage = metadata.image?.startsWith("https://");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Image
          src={isImage ? metadata.image : "/background.jpg"}
          alt={metadata.name}
          width={400}
          height={400}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-xl">{metadata.name}</CardTitle>
        <p className="text-sm text-muted-foreground mb-5 min-h-[40px]">
          {truncateString(metadata.description, 99)}
        </p>
        <div className="flex justify-between items-center mb-2">
          <Badge variant="default">
            {metadata.attributes?.[2]?.value ?? "MIP"}
          </Badge>
          <Badge variant="secondary">
            {metadata.attributes?.[0]?.value ?? "MIP"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex flex-wrap gap-2">
        <Link href={`/asset/${tokenId}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>More</DropdownMenuLabel>
            <DropdownMenuSeparator />

          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};
