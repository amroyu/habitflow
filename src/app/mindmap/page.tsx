'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Dynamically import the MindmapEditor to avoid SSR issues with ReactFlow
const MindmapEditor = dynamic(
  () => import('@/components/mindmap/MindmapEditor'),
  { ssr: false }
);

export default function MindmapPage() {
  const [title, setTitle] = useState('Untitled Mindmap');

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="border-b">
        <div className="container flex items-center gap-4 h-[60px]">
          <div className="flex items-center gap-4 flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="max-w-[300px] h-9 px-2 text-base bg-transparent border-none hover:bg-accent/50 focus-visible:bg-accent/50 transition-colors"
              placeholder="Untitled Mindmap"
            />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-4 text-sm font-normal"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-4 text-sm font-normal"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full">
        <MindmapEditor />
      </div>
    </div>
  );
}
