import { useMemo, useState } from "react";
import { Demande, DemandeStatut, DemandeType } from "../data/mockDemandes";
import {
  getUrgency,
  sortDemandes,
  type SortKey,
} from "@/lib/demandes";
import { Badge } from "@/shared/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { STATUT_LABEL } from "./StatutBadge";
import { Card, CardContent } from "@/shared/components/ui/card";
import EmptyState from "@/shared/components/ui/empty-state";
import { DemandeTable } from "./DemandeTable";

interface SectionProps {
  type: DemandeType;
  demandes: Demande[];
}

export default function DemandeSection({ type, demandes }: SectionProps) {
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