import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { mockAssets, mockCollections } from '@/lib/dapp-data'
import { useState } from 'react'

export function TrendingAssetsSection() {
  const trendingAssets = mockAssets.sort((a, b) => b.views - a.views).slice(0, 4)

  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center mb-12">Trending Assets</h2>
        <div className="overflow-x-auto bg-background/80 rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Asset Name</th>
                <th className="text-left p-4">Type</th>
                <th className="text-right p-4">Views</th>
                <th className="text-right p-4">Likes</th>
                <th className="text-center p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {trendingAssets.map((asset) => (
                <tr key={asset.id} className="border-b hover:/50 transition-colors">
                  <td className="p-4">{asset.name}</td>
                  <td className="p-4">{asset.type}</td>
                  <td className="p-4 text-right">{asset.views.toLocaleString()}</td>
                  <td className="p-4 text-right">{asset.likes.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <Link href={`/asset/${asset.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}