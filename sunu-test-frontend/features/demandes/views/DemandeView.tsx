import { DemandeList } from "@/features/demandes/components/DemandeList";
import { getStats } from "../services/demande-services";
import { Card, CardContent } from "@/shared/components/ui/card";

export default function DemandeView() {
  const cotation = getStats("COTATION");
  const placement = getStats("PLACEMENT");
  return (
    <div>
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">COTATIONS</div>
            <div className="mt-2 text-2xl font-bold">{cotation.total}</div>
            <div className="mt-1 text-sm text-red-600">
              {cotation.enRetard} en retard
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-purple-50">
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">PLACEMENTS</div>
            <div className="mt-2 text-2xl font-bold">{placement.total}</div>
            <div className="mt-1 text-sm text-red-600">
              {placement.enRetard} en retard
            </div>
          </CardContent>
        </Card>
      </div>
      <DemandeList />
    </div>
  );
};