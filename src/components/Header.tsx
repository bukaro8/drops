import { CheckCircle2 } from "lucide-react";

interface HeaderProps {
  doneCount: number;
  totalCount: number;
}

export function Header({ doneCount, totalCount }: HeaderProps) {
  return (
    <header className="flex items-center justify-between pb-6">
      <h1 className="text-xl font-semibold">Drops Checklist</h1>
      {totalCount > 0 && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm">
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {doneCount}/{totalCount}
          </span>
        </span>
      )}
    </header>
  );
}