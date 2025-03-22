'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, BookOpen, Brain, FolderPlus, Image, Info } from 'lucide-react'
import { IPTemplates } from '@/components/IPTemplates'
import Link from 'next/link'

export default function NewContentPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const contentTypes = [
    { id: 'ip', name: 'Create New IP', icon: BookOpen, route: '/create' },
    { id: 'collection', name: 'Create New Collection', icon: FolderPlus, route: '/new/collection' },
  ]

  const handleSelection = (type: string) => {
    setSelectedType(type)
  }

  const handleContinue = () => {
    if (selectedType) {
      const selectedRoute = contentTypes.find(type => type.id === selectedType)?.route
      if (selectedRoute) {
        router.push(selectedRoute)
      }
    }
  }

  return (
    <> 
    <div className="container mx-auto p-4 mt-10 mb-20">
    
    <div className="space-y-6">

    <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl md:pl-6 font-bold">Create Programmable IP Assets</h1>
                <Link
                    href="/discover"
                    title='Learn more about protecting IP onchain'
                    className="flex items-center text-sm font-medium text-muted-foreground hover:underline"
                >
                    <Brain className="mr-2 h-4 w-4" />
                </Link>
            </div>
      
      <Card className='bg-background/60'>
        <CardHeader>
          <CardTitle className='text-lg font-semibold'>Start New</CardTitle>
          <CardDescription>Register a new Programmable IP or a new Collection to organize your digital assets.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {contentTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => handleSelection(type.id)}
              >
                <type.icon className="w-6 h-6 mr-2 text-blue-600" />
                {type.name}
              </Button>
            ))}
          </div>
          <Button
            className="w-full mt-6"
            disabled={!selectedType}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </CardContent>
      </Card>



      <IPTemplates />


      <section className="space-y-6 mt-10">
      <div className="bg-background/60 p-8 rounded-lg shadow">
      <h1 className="text-lg font-semibold">Protecting Intellectual Property Onchain</h1>
      <p className=" mx-auto mt-4">
      Registering Intellectual Property on Mediolano means the asset is automatically tokenize and protected in 181 countries, according to The Berne Convention for the Protection of Literary and Artistic Works, adopted in 1886, which guarantees recognition of the authorship of IP without the need for registration with WIPO (World Intellectual Property Organization). 
      </p>
      <div className="flex space-x-4 mt-6">
        
          <Link href="/discover"><Button size="lg" variant="outline">
          Learn more <ArrowRight className="ml-2 h-4 w-4" />
          </Button></Link>
      </div>
      </div>
    </section>


            
    </div>

    </div>
    </>
  )
}

