import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, MapPin, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";
import type { Drop } from "../types";

interface DropCardProps {
  drop: Drop;
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DropCard({ drop, onToggleDone, onDelete }: DropCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: drop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${drop.address}, ${drop.postcode}`
  )}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm",
        isDragging && "opacity-50",
        drop.done && "opacity-60"
      )}
    >
      <button
        onClick={() => onToggleDone(drop.id)}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded border-2 transition-colors shrink-0",
          drop.done
            ? "bg-primary border-primary text-primary-foreground"
            : "border-input hover:border-primary"
        )}
        aria-label={drop.done ? "Mark as not done" : "Mark as done"}
      >
        {drop.done && <Check className="h-3.5 w-3.5" />}
      </button>

      <div className={cn("flex-1 min-w-0", drop.done && "line-through")}>
        <p className="font-medium truncate">{drop.name}</p>
        <p className="text-sm text-muted-foreground truncate">{drop.address}</p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <span>{drop.postcode}</span>
          <span>•</span>
          <span className="font-mono">{drop.time}</span>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline ml-1"
            onClick={(e) => e.stopPropagation()}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs">Navigate</span>
          </a>
        </p>
      </div>

      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground shrink-0"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <button
        onClick={() => onDelete(drop.id)}
        className="p-1 text-muted-foreground hover:text-destructive shrink-0"
        aria-label="Delete drop"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}