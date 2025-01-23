import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react'

interface CommunityNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  status: 'pending' | 'approved' | 'rejected';
  type: 'clarification' | 'fact-check' | 'additional-context';
}

interface CommunityNotesProps {
  publicationId: string;
}

const mockNotes: CommunityNote[] = [
  { id: '1', content: 'This article provides a great introduction to zk-STARKs, but it\'s worth noting that the technology is still evolving.', author: 'Alice', createdAt: '2023-06-15T10:00:00Z', upvotes: 15, downvotes: 2, status: 'approved', type: 'additional-context' },
  { id: '2', content: 'The comparison with zk-SNARKs in the third paragraph is not entirely accurate. zk-SNARKs do not always require a trusted setup.', author: 'Bob', createdAt: '2023-06-16T14:30:00Z', upvotes: 8, downvotes: 3, status: 'pending', type: 'fact-check' },
  { id: '3', content: 'For readers new to cryptography, it might be helpful to explain what "zero-knowledge" means in this context.', author: 'Charlie', createdAt: '2023-06-17T09:45:00Z', upvotes: 12, downvotes: 1, status: 'approved', type: 'clarification' },
]

export function CommunityNotes({ publicationId }: CommunityNotesProps) {
  const [notes, setNotes] = useState<CommunityNote[]>(mockNotes)
  const [newNote, setNewNote] = useState('')
  const [newNoteType, setNewNoteType] = useState<CommunityNote['type']>('additional-context')
  const { toast } = useToast()

  useEffect(() => {
    // In a real application, fetch notes for the specific publication
    // For now, we'll use the mock data
  }, [publicationId])

  const handleAddNote = () => {
    if (newNote.trim() === '') return

    const note: CommunityNote = {
      id: Date.now().toString(),
      content: newNote,
      author: 'Current User', // In a real app, this would be the logged-in user
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      status: 'pending',
      type: newNoteType,
    }

    setNotes([...notes, note])
    setNewNote('')

    toast({
      title: "Note Submitted",
      description: "Your community note has been submitted for review.",
    })
  }

  const handleVote = (id: string, isUpvote: boolean) => {
    setNotes(notes.map(note => {
      if (note.id === id) {
        if (isUpvote) {
          return { ...note, upvotes: note.upvotes + 1 }
        } else {
          return { ...note, downvotes: note.downvotes + 1 }
        }
      }
      return note
    }))
  }

  const getStatusIcon = (status: CommunityNote['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-yellow-500" />;
    }
  }

  const getTypeIcon = (type: CommunityNote['type']) => {
    switch (type) {
      case 'clarification':
        return <HelpCircle className="h-4 w-4" />;
      case 'fact-check':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'additional-context':
        return <AlertTriangle className="h-4 w-4" />;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Notes</CardTitle>
        <CardDescription>Collaborate to add context and clarify information</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="view">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View Notes</TabsTrigger>
            <TabsTrigger value="add">Add Note</TabsTrigger>
          </TabsList>
          <TabsContent value="view">
            <div className="space-y-4">
              {notes.map(note => (
                <Card key={note.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{note.author[0]}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-sm font-medium">{note.author}</CardTitle>
                      </div>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        {getStatusIcon(note.status)}
                        <span>{note.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge className="mb-2" variant="secondary">
                      {getTypeIcon(note.type)}
                      <span className="ml-1">{note.type}</span>
                    </Badge>
                    <p className="text-sm">{note.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleVote(note.id, true)}>
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {note.upvotes}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleVote(note.id, false)}>
                        <ThumbsDown className="mr-1 h-4 w-4" />
                        {note.downvotes}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="add">
            <form onSubmit={(e) => { e.preventDefault(); handleAddNote(); }} className="space-y-4">
              <div>
                <label htmlFor="note-type" className="block text-sm font-medium text-gray-700">Note Type</label>
                <select
                  id="note-type"
                  value={newNoteType}
                  onChange={(e) => setNewNoteType(e.target.value as CommunityNote['type'])}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="clarification">Clarification</option>
                  <option value="fact-check">Fact Check</option>
                  <option value="additional-context">Additional Context</option>
                </select>
              </div>
              <Textarea
                placeholder="Add a community note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
              />
              <Button type="submit">Mint Note</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

