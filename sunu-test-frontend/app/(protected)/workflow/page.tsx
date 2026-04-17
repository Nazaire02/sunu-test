import { StatutBadge } from "@/features/demandes/components/StatutBadge";
import { mockDemandes } from "@/features/demandes/data/mockDemandes";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ArrowRight, Badge, Workflow } from "lucide-react";
import Link from "next/link";

export default function WorkflowIndex() {
  const cotations = mockDemandes.filter((d) => d.type === "COTATION");

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
          <Workflow className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Workflow cotation</h1>
          <p className="text-sm text-muted-foreground">
            Sélectionnez une demande pour visualiser son avancement et effectuer les actions
            disponibles.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {cotations.map((d) => (
          <Card key={d.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{d.id}</CardTitle>
                  <CardDescription className="font-mono text-xs">
                    {d.contratId}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    // variant="outline"
                    className="border-blue-200 bg-blue-100 text-blue-900"
                  >
                    COTATION
                  </Badge>
                  <StatutBadge statut={d.statut} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-0">
              <span className="text-sm text-muted-foreground">
                Réassureur :{" "}
                {d.reassureur ?? (
                  <span className="italic">Non assigné</span>
                )}
              </span>
              <Button asChild size="sm" variant="outline">
                <Link href="/demandes/$id">
                  Ouvrir
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        L'interface complète de pilotage du workflow (étapes, actions contextuelles, contrôles
        d'autorisation) sera ajoutée ici.
      </div>
    </div>
  );
}

