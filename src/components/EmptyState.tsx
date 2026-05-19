import { Package } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-secondary p-4 mb-4">
        <Package className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-2">No drops yet</h3>
      <p className="text-muted-foreground text-sm">
        No drops yet. Import a route via the URL.
      </p>
    </div>
  );
}