"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  LayoutGrid,
  PlusCircle,
  Moon,
  Sun,
  Laptop,
  GitBranch,
  ArrowRightLeft,
  Flame,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    const openMenu = () => setOpen(true)

    document.addEventListener("keydown", down)
    document.addEventListener("openCommandMenu", openMenu)

    return () => {
      document.removeEventListener("keydown", down)
      document.removeEventListener("openCommandMenu", openMenu)
    }
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(() => router.push("/create/asset"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Create Asset</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/create/collection"))}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>Create Collection</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/create/remix"))}>
            <GitBranch className="mr-2 h-4 w-4" />
            <span>Create Remix</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/transfer"))}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            <span>Transfer Asset</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/burn"))}>
            <Flame className="mr-2 h-4 w-4" />
            <span>Burn Asset</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/portfolio"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Portfolio</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Laptop className="mr-2 h-4 w-4" />
            <span>System</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
