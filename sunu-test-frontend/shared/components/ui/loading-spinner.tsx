import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
  size?: number;
}

export function LoadingSpinner({
  className,
  text = "Chargement...",
  size = 32,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-muted-foreground",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="animate-spin" size={size} />
      {text && <p className="text-sm">{text}</p>}
    </div>
  );
}