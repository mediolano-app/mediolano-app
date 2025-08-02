"use client"

import type React from "react"

import { useState, useRef, type KeyboardEvent } from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TagInputProps {
  tags: string[]
  setTags: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  disabled?: boolean
}

export function TagInput({ tags, setTags, placeholder = "Add tag...", maxTags = 10, disabled = false }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const addTag = () => {
    const trimmedInput = inputValue.trim()
    if (trimmedInput && !tags.includes(trimmedInput) && tags.length < maxTags) {
      setTags([...tags, trimmedInput])
      setInputValue("")
    }
  }

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
  }

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-1.5 p-1.5 border rounded-md bg-background focus-within:ring-1 focus-within:ring-ring"
      onClick={focusInput}
    >
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="h-7 px-2 text-sm">
          {tag}
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 ml-1 p-0 hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation()
              removeTag(index)
            }}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {tag}</span>
          </Button>
        </Badge>
      ))}
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        className="flex-1 min-w-[120px] border-0 p-0 pl-1 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder={tags.length < maxTags ? placeholder : `Maximum ${maxTags} tags`}
        disabled={disabled || tags.length >= maxTags}
      />
    </div>
  )
}

