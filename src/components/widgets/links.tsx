"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link as LinkIcon, Plus, Trash2, ExternalLink } from "lucide-react";
import { WidgetBase } from "./widget-base";

interface LinkItem {
  id: string;
  title: string;
  url: string;
}

interface LinksProps {
  links?: LinkItem[];
  onRemove?: () => void;
  onEdit?: () => void;
  onChange?: (links: LinkItem[]) => void;
}

export function Links({ links = [], onRemove, onEdit, onChange }: LinksProps) {
  const [linkList, setLinkList] = useState<LinkItem[]>(links);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAddLink = () => {
    if (newTitle.trim() && newUrl.trim()) {
      const newLink = {
        id: String(Date.now()),
        title: newTitle.trim(),
        url: newUrl.trim().startsWith("http") ? newUrl.trim() : `https://${newUrl.trim()}`,
      };

      const updatedLinks = [...linkList, newLink];
      setLinkList(updatedLinks);
      onChange?.(updatedLinks);
      setNewTitle("");
      setNewUrl("");
    }
  };

  const handleRemoveLink = (id: string) => {
    const updatedLinks = linkList.filter((link) => link.id !== id);
    setLinkList(updatedLinks);
    onChange?.(updatedLinks);
  };

  return (
    <WidgetBase title="Links" onRemove={onRemove} onEdit={onEdit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Link Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div className="flex space-x-2">
            <Input
              placeholder="URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddLink}
              disabled={!newTitle.trim() || !newUrl.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[200px] w-full rounded-md border p-2">
          {linkList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <LinkIcon className="w-8 h-8 mb-2" />
              <p className="text-sm">No links added</p>
            </div>
          ) : (
            <div className="space-y-2">
              {linkList.map((link) => (
                <Card
                  key={link.id}
                  className="p-2 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-4 h-4" />
                    <span className="text-sm truncate max-w-[150px]">
                      {link.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.open(link.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </WidgetBase>
  );
}
