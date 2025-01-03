"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Timer,
  Calculator,
  StickyNote,
  CheckSquare,
  LineChart,
  File,
  Link,
  Image,
  Calendar,
  Layout,
} from "lucide-react";
import type { Widget, WidgetSettings } from "@/types";

interface WidgetOption {
  id: string;
  title: string;
  description: string;
  type: Widget["type"];
  icon: React.ReactNode;
}

const widgetOptions: WidgetOption[] = [
  {
    id: "pomodoro-timer",
    title: "Pomodoro Timer",
    description: "Focus timer with work and break intervals",
    type: "pomodoro-timer",
    icon: <Timer className="h-6 w-6" />,
  },
  {
    id: "counter",
    title: "Counter",
    description: "Track numbers and counts",
    type: "counter",
    icon: <Calculator className="h-6 w-6" />,
  },
  {
    id: "notes",
    title: "Notes",
    description: "Quick notes and reminders",
    type: "notes",
    icon: <StickyNote className="h-6 w-6" />,
  },
  {
    id: "checklist",
    title: "Checklist",
    description: "Track subtasks and to-dos",
    type: "checklist",
    icon: <CheckSquare className="h-6 w-6" />,
  },
  {
    id: "progress-chart",
    title: "Progress Chart",
    description: "Visualize your progress",
    type: "progress-chart",
    icon: <LineChart className="h-6 w-6" />,
  },
  {
    id: "files",
    title: "Files",
    description: "Store and organize files",
    type: "files",
    icon: <File className="h-6 w-6" />,
  },
  {
    id: "links",
    title: "Links",
    description: "Collect and organize useful links",
    type: "links",
    icon: <Link className="h-6 w-6" />,
  },
  {
    id: "gallery",
    title: "Gallery",
    description: "Organize images and photos",
    type: "gallery",
    icon: <Image className="h-6 w-6" />,
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "Schedule and track events",
    type: "calendar",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    id: "kanban",
    title: "Kanban",
    description: "Organize tasks in columns",
    type: "kanban",
    icon: <Layout className="h-6 w-6" />,
  },
];

interface WidgetSettingsDialogProps {
  widget: Widget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: WidgetSettings) => void;
}

export function WidgetSettingsDialog({
  widget,
  open,
  onOpenChange,
  onSave,
}: WidgetSettingsDialogProps) {
  const [settings, setSettings] = useState<WidgetSettings>(
    widget.settings || {}
  );

  const handleSave = () => {
    onSave(settings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Widget Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Select Widget</TabsTrigger>
            <TabsTrigger value="configure">Configure</TabsTrigger>
          </TabsList>
          <TabsContent value="select" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-2 gap-4">
                {widgetOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-colors hover:bg-accent ${
                      widget.type === option.type ? "border-primary" : ""
                    }`}
                    onClick={() => {
                      onSave({ ...settings, type: option.type });
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {option.icon}
                        {option.title}
                      </CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="configure" className="mt-4">
            <ScrollArea className="h-[400px]">
              {renderWidgetSettings()}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  function renderWidgetSettings() {
    switch (widget.type) {
      case "pomodoro-timer":
        return renderPomodoroSettings();
      case "counter":
        return renderCounterSettings();
      case "notes":
        return renderNotesSettings();
      case "checklist":
        return renderChecklistSettings();
      case "progress-chart":
        return renderProgressChartSettings();
      case "files":
        return renderFilesSettings();
      case "links":
        return renderLinksSettings();
      case "gallery":
        return renderGallerySettings();
      case "calendar":
        return renderCalendarSettings();
      case "kanban":
        return renderKanbanSettings();
      default:
        return null;
    }
  }

  function renderPomodoroSettings() {
    return (
      <div className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="workDuration">Work Duration (minutes)</Label>
          <Input
            type="number"
            id="workDuration"
            value={settings.workDuration || 25}
            onChange={(e) =>
              setSettings({ ...settings, workDuration: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
          <Input
            type="number"
            id="breakDuration"
            value={settings.breakDuration || 5}
            onChange={(e) =>
              setSettings({ ...settings, breakDuration: parseInt(e.target.value) })
            }
          />
        </div>
      </div>
    );
  }

  function renderCounterSettings() {
    return (
      <div className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="initialValue">Initial Value</Label>
          <Input
            type="number"
            id="initialValue"
            value={settings.initialValue || 0}
            onChange={(e) =>
              setSettings({ ...settings, initialValue: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="increment">Increment</Label>
          <Input
            type="number"
            id="increment"
            value={settings.increment || 1}
            onChange={(e) =>
              setSettings({ ...settings, increment: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="target">Target Value (optional)</Label>
          <Input
            type="number"
            id="target"
            value={settings.target || ""}
            onChange={(e) =>
              setSettings({ ...settings, target: parseInt(e.target.value) })
            }
          />
        </div>
      </div>
    );
  }

  function renderNotesSettings() {
    return (
      <div className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label>Notes</Label>
          <Input
            type="text"
            value={settings.notes || ""}
            onChange={(e) =>
              setSettings({ ...settings, notes: e.target.value })
            }
          />
        </div>
      </div>
    );
  }

  function renderChecklistSettings() {
    return (
      <div className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label>Tasks</Label>
          <div className="space-y-2">
            {settings.tasks?.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  <span>{task.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      tasks: settings.tasks?.filter((t) => t.id !== task.id),
                    })
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Task Title" className="flex-1" />
            <Button>Add Task</Button>
          </div>
        </div>
      </div>
    );
  }

  function renderProgressChartSettings() {
    return (
      <div className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label>Progress</Label>
          <div className="space-y-2">
            {settings.progress?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      progress: settings.progress?.filter((p) => p.id !== item.id),
                    })
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Progress Title" className="flex-1" />
            <Button>Add Progress</Button>
          </div>
        </div>
      </div>
    );
  }

  function renderFilesSettings() {
    return (
      <div className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label>Uploaded Files</Label>
          <div className="space-y-2">
            {settings.files?.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      files: settings.files?.filter((f) => f.id !== file.id),
                    })
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <Button className="mt-2">Upload File</Button>
        </div>
      </div>
    );
  }

  function renderLinksSettings() {
    return (
      <div className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label>Saved Links</Label>
          <div className="space-y-2">
            {settings.links?.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  <span>{link.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      links: settings.links?.filter((l) => l.id !== link.id),
                    })
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Title" className="flex-1" />
            <Input placeholder="URL" className="flex-1" />
            <Button>Add Link</Button>
          </div>
        </div>
      </div>
    );
  }

  function renderGallerySettings() {
    return (
      <div className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label>Images</Label>
          <div className="grid grid-cols-3 gap-4">
            {settings.images?.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square rounded-lg border"
              >
                <img
                  src={image.url}
                  alt={image.caption || ""}
                  className="absolute inset-0 h-full w-full object-cover rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      images: settings.images?.filter((i) => i.id !== image.id),
                    })
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <Button className="mt-2">Upload Image</Button>
        </div>
      </div>
    );
  }

  function renderCalendarSettings() {
    return (
      <div className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label>Events</Label>
          <div className="space-y-2">
            {settings.events?.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {event.startDate}
                    {event.endDate ? ` - ${event.endDate}` : ""}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      events: settings.events?.filter((e) => e.id !== event.id),
                    })
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Input placeholder="Event Title" />
            <div className="flex gap-2">
              <Input type="date" className="flex-1" />
              <Input type="date" className="flex-1" />
            </div>
            <Button>Add Event</Button>
          </div>
        </div>
      </div>
    );
  }

  function renderKanbanSettings() {
    return (
      <div className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label>Columns</Label>
          <div className="space-y-2">
            {settings.columns?.map((column) => (
              <div
                key={column.id}
                className="rounded-lg border p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{column.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        columns: settings.columns?.filter((c) => c.id !== column.id),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
                <div className="space-y-2 pl-4">
                  {column.cards.map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between rounded border p-2"
                    >
                      <span>{card.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            columns: settings.columns?.map((c) =>
                              c.id === column.id
                                ? {
                                    ...c,
                                    cards: c.cards.filter(
                                      (cd) => cd.id !== card.id
                                    ),
                                  }
                                : c
                            ),
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Input placeholder="Column Title" />
            <Button>Add Column</Button>
          </div>
        </div>
      </div>
    );
  }
}
