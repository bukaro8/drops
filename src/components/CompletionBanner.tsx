import { PartyPopper } from "lucide-react";

export function CompletionBanner() {
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-primary">
      <PartyPopper className="h-5 w-5" />
      <span className="font-medium">All done!</span>
    </div>
  );
}