"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, Plus, Trash2, Clock } from "lucide-react";
import { WidgetBase } from "./widget-base";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
}

interface CalendarProps {
  events?: Event[];
  onRemove?: () => void;
  onEdit?: () => void;
  onChange?: (events: Event[]) => void;
}

export function Calendar({ events = [], onRemove, onEdit, onChange }: CalendarProps) {
  const [eventList, setEventList] = useState<Event[]>(events);
  const [newTitle, setNewTitle] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

  const handleAddEvent = () => {
    if (newTitle.trim() && newStartDate) {
      const newEvent = {
        id: String(Date.now()),
        title: newTitle.trim(),
        startDate: newStartDate,
        endDate: newEndDate || undefined,
      };

      const updatedEvents = [...eventList, newEvent];
      setEventList(updatedEvents);
      onChange?.(updatedEvents);
      setNewTitle("");
      setNewStartDate("");
      setNewEndDate("");
    }
  };

  const handleRemoveEvent = (id: string) => {
    const updatedEvents = eventList.filter((event) => event.id !== id);
    setEventList(updatedEvents);
    onChange?.(updatedEvents);
  };

  const formatEventDate = (startDate: string, endDate?: string) => {
    if (!endDate) {
      return format(new Date(startDate), "MMM d, yyyy");
    }
    if (startDate.split("T")[0] === endDate.split("T")[0]) {
      return `${format(new Date(startDate), "MMM d, yyyy")} ${format(
        new Date(startDate),
        "HH:mm"
      )} - ${format(new Date(endDate), "HH:mm")}`;
    }
    return `${format(new Date(startDate), "MMM d")} - ${format(
      new Date(endDate),
      "MMM d, yyyy"
    )}`;
  };

  return (
    <WidgetBase title="Calendar" onRemove={onRemove} onEdit={onEdit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Event Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="datetime-local"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
            />
            <Input
              type="datetime-local"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              min={newStartDate}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleAddEvent}
            disabled={!newTitle.trim() || !newStartDate}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        <ScrollArea className="h-[200px] w-full rounded-md border p-2">
          {eventList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <CalendarIcon className="w-8 h-8 mb-2" />
              <p className="text-sm">No events scheduled</p>
            </div>
          ) : (
            <div className="space-y-2">
              {eventList
                .sort(
                  (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime()
                )
                .map((event) => (
                  <Card
                    key={event.id}
                    className="p-2 flex flex-col space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{event.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatEventDate(event.startDate, event.endDate)}
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
