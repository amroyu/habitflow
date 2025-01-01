import { X, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WidgetBaseProps {
  className?: string;
  title: string;
  subtitle?: string;
  onRemove?: () => void;
  onReset?: () => void;
  onEdit?: () => void;
  children: React.ReactNode;
}

export function WidgetBase({
  className,
  title,
  subtitle,
  onRemove,
  onReset,
  onEdit,
  children,
}: WidgetBaseProps) {
  return (
    <div className={cn("p-4 bg-card rounded-lg border shadow-sm space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {children}

      <div className="flex items-center justify-end gap-1">
        {onReset && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-primary/10"
            onClick={onReset}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        )}
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-primary/10"
            onClick={onEdit}
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
        )}
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
            onClick={onRemove}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
