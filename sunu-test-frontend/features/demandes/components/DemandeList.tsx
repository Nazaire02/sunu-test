"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import {
  getUrgency,
  sortDemandes,
  type SortKey,
} from "@/lib/demandes";
import type { Demande, DemandeStatut, DemandeType } from "../data/mockDemandes";
import { DemandeTable } from "./DemandeTable";
import { LoadingState } from "./LoadingState";
import { useDemandes } from "../hooks/useDemandes";
import { STATUT_LABEL } from "./StatutBadge";
import EmptyState from "@/shared/components/ui/empty-state";
import { ErrorState } from "./ErrorState";

const TAB_ACCENT: Record<
  DemandeType,
  { active: string; dot: string; label: string }
> = {
  COTATION: {
    active:
      "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 data-[state=active]:shadow-sm",
    dot: "bg-blue-500",
    label: "Cotations",
  },
  PLACEMENT: {
    active:
      "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 data-[state=active]:shadow-sm",
    dot: "bg-purple-500",
    label: "Placements",
  },
};

interface SectionProps {
  type: DemandeType;
  demandes: Demande[];
}

function DemandeSection({ type, demandes }: SectionProps) {
  const [statutFilter, setStatutFilter] = useState<DemandeStatut | "ALL">("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("delai_asc");

  const presentStatuts = useMemo(() => {
    const set = new Set<DemandeStatut>();
    demandes.forEach((d) => set.add(d.statut));
    return Array.from(set);
  }, [demandes]);

  const filtered = useMemo(() => {
    const list =
      statutFilter === "ALL" ? demandes : demandes.filter((d) => d.statut === statutFilter);
    return sortDemandes(list, sortKey);
  }, [demandes, statutFilter, sortKey]);

  const total = demandes.length;
  const enRetard = demandes.filter((d) => getUrgency(d.delaiLimite) === "expired").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="font-normal">
            Total : <span className="ml-1 font-semibold">{total}</span>
          </Badge>
          {enRetard > 0 ? (
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 font-normal" variant="outline">
              En retard : <span className="ml-1 font-semibold">{enRetard}</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="font-normal text-muted-foreground">
              En retard : <span className="ml-1 font-semibold">0</span>
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={statutFilter}
            onValueChange={(v) => setStatutFilter(v as DemandeStatut | "ALL")}
          >
            <SelectTrigger className="h-9 w-[200px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les statuts</SelectItem>
              {presentStatuts.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUT_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
            <SelectTrigger className="h-9 w-[220px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delai_asc">Délai limite (croissant)</SelectItem>
              <SelectItem value="montant_desc">Montant (décroissant)</SelectItem>
              <SelectItem value="montant_asc">Montant (croissant)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 md:p-2">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <DemandeTable demandes={filtered} type={type} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function DemandeList() {
  const { data, loading, error, refetch } = useDemandes();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-0">
          <LoadingState />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-0">
          <ErrorState onRetry={refetch} message={error ?? undefined} />
        </CardContent>
      </Card>
    );
  }

  const cotations = data.filter((d) => d.type === "COTATION");
  const placements = data.filter((d) => d.type === "PLACEMENT");

  const cotationsRetard = cotations.filter(
    (d) => getUrgency(d.delaiLimite) === "expired",
  ).length;
  const placementsRetard = placements.filter(
    (d) => getUrgency(d.delaiLimite) === "expired",
  ).length;

  return (
    <Tabs defaultValue="COTATION" className="w-full">
      <TabsList className="h-auto bg-muted/60 p-1">
        <TabsTrigger
          value="COTATION"
          className={`gap-2 px-4 py-2 ${TAB_ACCENT.COTATION.active}`}
        >
          <span className={`h-2 w-2 rounded-full ${TAB_ACCENT.COTATION.dot}`} />
          <span className="font-medium">Cotations</span>
          <span className="ml-1 rounded-md bg-background/70 px-1.5 py-0.5 text-xs">
            {cotations.length}
          </span>
          {cotationsRetard > 0 && (
            <span className="rounded-md bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">
              {cotationsRetard}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="PLACEMENT"
          className={`gap-2 px-4 py-2 ${TAB_ACCENT.PLACEMENT.active}`}
        >
          <span className={`h-2 w-2 rounded-full ${TAB_ACCENT.PLACEMENT.dot}`} />
          <span className="font-medium">Placements</span>
          <span className="ml-1 rounded-md bg-background/70 px-1.5 py-0.5 text-xs">
            {placements.length}
          </span>
          {placementsRetard > 0 && (
            <span className="rounded-md bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">
              {placementsRetard}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="COTATION" className="mt-6">
        <DemandeSection type="COTATION" demandes={cotations} />
      </TabsContent>
      <TabsContent value="PLACEMENT" className="mt-6">
        <DemandeSection type="PLACEMENT" demandes={placements} />
      </TabsContent>
    </Tabs>
  );
}