'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Widget, WidgetSettings } from "@/types";

interface WidgetSettingsDialogProps {
  widget: Widget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: WidgetSettings) => void;
}

export function WidgetSettingsDialog({ widget, open, onOpenChange, onSave }: WidgetSettingsDialogProps) {
  const [settings, setSettings] = useState<WidgetSettings>(widget.settings || {});

  const handleSave = () => {
    onSave(settings);
    onOpenChange(false);
  };

  const renderPomodoroSettings = () => (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="workDuration">Work Duration (minutes)</Label>
        <Input
          type="number"
          id="workDuration"
          value={settings.workDuration || 25}
          onChange={(e) => setSettings({ ...settings, workDuration: parseInt(e.target.value) })}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
        <Input
          type="number"
          id="breakDuration"
          value={settings.breakDuration || 5}
          onChange={(e) => setSettings({ ...settings, breakDuration: parseInt(e.target.value) })}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="longBreakDuration">Long Break Duration (minutes)</Label>
        <Input
          type="number"
          id="longBreakDuration"
          value={settings.longBreakDuration || 15}
          onChange={(e) => setSettings({ ...settings, longBreakDuration: parseInt(e.target.value) })}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="sessionsBeforeLongBreak">Sessions Before Long Break</Label>
        <Input
          type="number"
          id="sessionsBeforeLongBreak"
          value={settings.sessionsBeforeLongBreak || 4}
          onChange={(e) => setSettings({ ...settings, sessionsBeforeLongBreak: parseInt(e.target.value) })}
        />
      </div>
    </div>
  );

  const renderCounterSettings = () => (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="initialValue">Initial Value</Label>
        <Input
          type="number"
          id="initialValue"
          value={settings.initialValue || 0}
          onChange={(e) => setSettings({ ...settings, initialValue: parseInt(e.target.value) })}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="increment">Increment</Label>
        <Input
          type="number"
          id="increment"
          value={settings.increment || 1}
          onChange={(e) => setSettings({ ...settings, increment: parseInt(e.target.value) })}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="target">Target Value (optional)</Label>
        <Input
          type="number"
          id="target"
          value={settings.target || ''}
          onChange={(e) => setSettings({ ...settings, target: parseInt(e.target.value) })}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Widget Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {widget.type === 'pomodoro-timer' && renderPomodoroSettings()}
          {widget.type === 'counter' && renderCounterSettings()}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
