import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function ErrorState({ onRetry, message }: { onRetry: () => void; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <p className="text-sm font-medium text-foreground">
        {message ?? "Impossible de charger les demandes"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Une erreur est survenue lors du chargement.
      </p>
      <Button onClick={onRetry} className="mt-4" size="sm">
        Réessayer
      </Button>
    </div>
  );
}