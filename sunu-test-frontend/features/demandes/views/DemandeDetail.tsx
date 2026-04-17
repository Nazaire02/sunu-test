"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { mockDemandes } from "@/features/demandes/data/mockDemandes";
import { StatutBadge } from "@/features/demandes/components/StatutBadge";
import { DelaiCell } from "@/features/demandes/components/DetailCell";
import { Field } from "../components/Field";
import { formatMontant } from "@/lib/demandes";

export default function DemandeDetailView() {
  const params = useParams();

  const d = mockDemandes.find((x) => x.id === params.id);

  if (!d) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Demande introuvable</h1>
        <p className="mt-2 text-muted-foreground">
          Cette demande n'existe pas ou a été supprimée.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Retour au tableau de bord</Link>
        </Button>
      </div>
    );
  }

  const accent = d.type === "COTATION" ? "blue" : "purple";

  return (
    <div className="space-y-6">
      <div className="bg-card">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Demande de réassurance
              </p>
              <h1 className="text-2xl font-semibold text-foreground">{d.id}</h1>
            </div>

            <Badge
              variant="outline"
              className={
                accent === "blue"
                  ? "border-blue-200 bg-blue-100 text-blue-900"
                  : "border-purple-200 bg-purple-100 text-purple-900"
              }
            >
              {d.type}
            </Badge>
          </div>
        </div>
      </div>

      <div>
        <Card
          className={
            accent === "blue"
              ? "border-l-4 border-l-blue-500"
              : "border-l-4 border-l-purple-500"
          }
        >
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <Field label="Référence">{d.id}</Field>

            <Field label="Contrat source">
              <span className="font-mono">{d.contratId}</span>
            </Field>

            <Field label="Type">{d.type}</Field>

            <Field label="Statut">
              <StatutBadge statut={d.statut} />
            </Field>

            <Field label="Réassureur">
              {d.reassureur ?? (
                <span className="italic text-muted-foreground">Non assigné</span>
              )}
            </Field>

            <Field label="Montant">
              <span className="font-medium tabular-nums">
                {formatMontant(d.montant, d.devise)}
              </span>
            </Field>

            <Field label="Délai limite">
              <div className="flex flex-col gap-1">
                <DelaiCell dateStr={d.delaiLimite} />
              </div>
            </Field>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}