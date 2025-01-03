"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layout, Plus, Trash2, GripVertical } from "lucide-react";
import { WidgetBase } from "./widget-base";

interface KanbanCard {
  id: string;
  title: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

interface KanbanProps {
  columns?: KanbanColumn[];
  onRemove?: () => void;
  onEdit?: () => void;
  onChange?: (columns: KanbanColumn[]) => void;
}

export function Kanban({
  columns = [],
  onRemove,
  onEdit,
  onChange,
}: KanbanProps) {
  const [columnList, setColumnList] = useState<KanbanColumn[]>(columns);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newCardTitle, setNewCardTitle] = useState("");
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn = {
        id: String(Date.now()),
        title: newColumnTitle.trim(),
        cards: [],
      };

      const updatedColumns = [...columnList, newColumn];
      setColumnList(updatedColumns);
      onChange?.(updatedColumns);
      setNewColumnTitle("");
    }
  };

  const handleAddCard = (columnId: string) => {
    if (newCardTitle.trim()) {
      const newCard = {
        id: String(Date.now()),
        title: newCardTitle.trim(),
      };

      const updatedColumns = columnList.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      );

      setColumnList(updatedColumns);
      onChange?.(updatedColumns);
      setNewCardTitle("");
      setActiveColumn(null);
    }
  };

  const handleRemoveColumn = (columnId: string) => {
    const updatedColumns = columnList.filter((col) => col.id !== columnId);
    setColumnList(updatedColumns);
    onChange?.(updatedColumns);
  };

  const handleRemoveCard = (columnId: string, cardId: string) => {
    const updatedColumns = columnList.map((col) =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
        : col
    );
    setColumnList(updatedColumns);
    onChange?.(updatedColumns);
  };

  return (
    <WidgetBase title="Kanban" onRemove={onRemove} onEdit={onEdit}>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="New Column"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddColumn}
            disabled={!newColumnTitle.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[400px] w-full rounded-md border p-2">
          {columnList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Layout className="w-8 h-8 mb-2" />
              <p className="text-sm">No columns added</p>
            </div>
          ) : (
            <div className="flex space-x-4">
              {columnList.map((column) => (
                <div
                  key={column.id}
                  className="flex-shrink-0 w-64 bg-muted/50 rounded-lg p-2"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{column.title}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveColumn(column.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {column.cards.map((card) => (
                      <Card
                        key={card.id}
                        className="p-2 cursor-move bg-background"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <span>{card.title}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              handleRemoveCard(column.id, card.id)
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}

                    {activeColumn === column.id ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Card Title"
                          value={newCardTitle}
                          onChange={(e) => setNewCardTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddCard(column.id);
                            } else if (e.key === "Escape") {
                              setActiveColumn(null);
                              setNewCardTitle("");
                            }
                          }}
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleAddCard(column.id)}
                          >
                            Add
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setActiveColumn(null);
                              setNewCardTitle("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setActiveColumn(column.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Card
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </WidgetBase>
  );
}
