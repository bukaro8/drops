import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DropCard } from "./DropCard";
import type { Drop } from "../types";

interface DropListProps {
  drops: Drop[];
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
}

export function DropList({
  drops,
  onToggleDone,
  onDelete,
  onReorder,
}: DropListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    onReorder(active.id as string, over.id as string);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={drops.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {drops.map((drop) => (
            <DropCard
              key={drop.id}
              drop={drop}
              onToggleDone={onToggleDone}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}