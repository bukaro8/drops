import { Toaster } from "sonner";
import { useDrops } from "./hooks/useDrops";
import { Header } from "./components/Header";
import { DropList } from "./components/DropList";
import { EmptyState } from "./components/EmptyState";
import { CompletionBanner } from "./components/CompletionBanner";

function App() {
  const { drops, doneCount, totalCount, toggleDone, deleteDrop, reorderDrops } = useDrops();

  const allDone = drops.length > 0 && doneCount === totalCount;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <Header doneCount={doneCount} totalCount={totalCount} />

        {drops.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <DropList
              drops={drops}
              onToggleDone={toggleDone}
              onDelete={deleteDrop}
              onReorder={reorderDrops}
            />
            {allDone && <CompletionBanner />}
          </>
        )}
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;