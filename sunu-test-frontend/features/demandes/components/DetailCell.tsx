import { AlertTriangle, Clock } from "lucide-react";
import { formatDelai, getUrgency } from "@/lib/demandes";

export function DelaiCell({ dateStr }: { dateStr: string }) {
  const urgency = getUrgency(dateStr);
  const formatted = formatDelai(dateStr);

  if (urgency === "expired") {
    return (
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <div className="flex flex-col">
          <span className="font-medium text-red-700">{formatted}</span>
          <span className="text-xs text-red-600">En retard</span>
        </div>
      </div>
    );
  }

  if (urgency === "soon") {
    return (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-orange-500" />
        <div className="flex flex-col">
          <span className="font-medium text-orange-700">{formatted}</span>
          <span className="text-xs text-orange-600">&lt; 48h</span>
        </div>
      </div>
    );
  }

  return <span className="text-foreground">{formatted}</span>;
}