"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotesProps {
  className?: string;
  initialNotes?: string[];
  onNotesChange?: (notes: string[]) => void;
}

export function Notes({
  className,
  initialNotes = [],
  onNotesChange,
}: NotesProps) {
  const [notes, setNotes] = useState<string[]>(initialNotes);
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedNotes = [...notes, newNote.trim()];
      setNotes(updatedNotes);
      setNewNote("");
      onNotesChange?.(updatedNotes);
    }
  };

  const handleRemoveNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    onNotesChange?.(updatedNotes);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddNote();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Quick Notes</h3>
        <span className="text-xs text-muted-foreground">
          {notes.length} notes
        </span>
      </div>

      <div className="flex gap-2">
        <Input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a note..."
          className="h-8"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddNote}
          disabled={!newNote.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[120px]">
        <div className="space-y-2">
          {notes.map((note, index) => (
            <div
              key={index}
              className="group flex items-start gap-2 rounded-lg border p-2 text-sm"
            >
              <p className="flex-1">{note}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveNote(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
