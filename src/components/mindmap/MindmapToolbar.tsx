import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  StickyNote,
  Tag,
  Link2,
  Paperclip,
  Mic,
  Sticker,
  Image as ImageIcon,
  FileImage,
  FunctionSquare,
  Timer,
  Clock,
  CheckSquare,
  Pencil,
  GitBranch,
  FileText,
  Square,
  Circle,
  Globe,
  File,
  Folder,
  Settings2,
  Undo2,
  Redo2,
} from 'lucide-react';

type InsertOption = {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: Array<{
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

const insertOptions: InsertOption[] = [
  { value: 'default', label: 'Topic', icon: Pencil },
  { value: 'note', label: 'Note', icon: StickyNote },
  { 
    value: 'link', 
    label: 'Link', 
    icon: Link2,
    submenu: [
      { value: 'webpage', label: 'Webpage', icon: Globe },
      { value: 'topic-link', label: 'Topic', icon: FileText },
      { value: 'local-file', label: 'Local File', icon: File },
      { value: 'local-folder', label: 'Local Folder', icon: Folder },
    ]
  },
  { value: 'attachment', label: 'Attachment', icon: Paperclip },
  { value: 'audio', label: 'Audio Note', icon: Mic },
  { value: 'sticker', label: 'Sticker', icon: Sticker },
  { value: 'illustration', label: 'Illustration', icon: ImageIcon },
  { value: 'todo', label: 'Todo Items', icon: CheckSquare },
  { value: 'image', label: 'Local Image', icon: FileImage },
  { value: 'equation', label: 'Equation', icon: FunctionSquare },
  { value: 'countdown', label: 'Countdown', icon: Clock },
  { value: 'timer', label: 'Timer', icon: Timer }
];

interface MindmapToolbarProps {
  onInsert: (sourceId: string, side: 'left' | 'right') => void;
  onSettings: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function MindmapToolbar({ 
  onInsert, 
  onSettings,
  onUndo,
  onRedo,
  canUndo,
  canRedo 
}: MindmapToolbarProps) {
  const [showInsertMenu, setShowInsertMenu] = useState(false);

  return (
    <div className="flex items-center gap-2 p-2 border-b border-border">
      <Button
        variant="ghost"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
      >
        <Undo2 size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRedo}
        disabled={!canRedo}
      >
        <Redo2 size={16} />
      </Button>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8">
          <Pencil size={16} className="mr-2" />
          Topic
        </Button>
        <Button variant="ghost" size="sm" className="h-8">
          <GitBranch size={16} className="mr-2" />
          Subtopic
        </Button>
        <Button variant="ghost" size="sm" className="h-8">
          <Link2 size={16} className="mr-2" />
          Relationship
        </Button>
        <Button variant="ghost" size="sm" className="h-8">
          <FileText size={16} className="mr-2" />
          Summary
        </Button>
        <Button variant="ghost" size="sm" className="h-8">
          <Square size={16} className="mr-2" />
          Boundary
        </Button>
        <Button variant="ghost" size="sm" className="h-8">
          <Circle size={16} className="mr-2" />
          Marker
        </Button>
        <DropdownMenu open={showInsertMenu} onOpenChange={setShowInsertMenu}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Plus size={16} />
              Insert
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {insertOptions.map((option) => {
              const IconComponent = option.icon;
              if (option.submenu) {
                return (
                  <DropdownMenuSub key={option.value}>
                    <DropdownMenuSubTrigger className="flex items-center">
                      <IconComponent className="h-4 w-4 mr-2" />
                      {option.label}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {option.submenu.map((subItem) => {
                          const SubIconComponent = subItem.icon;
                          return (
                            <DropdownMenuItem
                              key={subItem.value}
                              onClick={() => {
                                onInsert?.(`${option.value}:${subItem.value}`, 'left');
                                setShowInsertMenu(false);
                              }}
                              className="flex items-center"
                            >
                              <SubIconComponent className="h-4 w-4 mr-2" />
                              {subItem.label}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                );
              }
              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => {
                    onInsert?.(option.value, 'left');
                    setShowInsertMenu(false);
                  }}
                  className="flex items-center"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {option.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="sm" className="h-8 ml-auto" onClick={onSettings}>
          <Settings2 size={16} className="mr-2" />
          Style
        </Button>
      </div>
    </div>
  );
}
