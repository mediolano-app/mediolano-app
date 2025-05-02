"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

export function SearchAndFilter() {
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useIsMobile()

  const clearSearch = () => setSearchQuery("")

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex w-full items-center gap-2 md:w-auto">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assets..."
            className="w-full bg-background pl-8 pr-8 md:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Filter Assets</SheetTitle>
                <SheetDescription>Apply filters to narrow down your asset list</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-6">
                <div className="space-y-2">
                  <Label>Asset Type</Label>
                  <RadioGroup defaultValue="all">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">All Types</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="original" id="original" />
                      <Label htmlFor="original">Original</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="license" id="license" />
                      <Label htmlFor="license">License</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="active" />
                      <Label htmlFor="active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="inactive" />
                      <Label htmlFor="inactive">Inactive</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select defaultValue="newest">
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                      <SelectItem value="licenses">Most Licenses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter className="mt-6 flex-row gap-2">
                <Button variant="outline" className="flex-1">
                  Reset
                </Button>
                <SheetClose asChild>
                  <Button className="flex-1">Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ) : (
          <Button variant="outline" size="icon" className="shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        )}
      </div>

      {!isMobile && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="original">Original</SelectItem>
              <SelectItem value="license">License</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="newest">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="licenses">Most Licenses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
