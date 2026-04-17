"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import type { DemandeType } from "../data/mockDemandes";
import { LoadingState } from "./LoadingState";
import { useDemandes } from "../hooks/useDemandes";
import { ErrorState } from "./ErrorState";
import DemandeSection from "./DemandeSection";

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

  return (
    <Tabs defaultValue="COTATION" className="w-full">
      <TabsList className="h-auto bg-muted/60 p-1">
        <TabsTrigger
          value="COTATION"
          className={`gap-2 px-4 py-2 ${TAB_ACCENT.COTATION.active}`}
        >
          <span className="font-medium">Cotations</span>
          <span className="ml-1 rounded-md bg-background/70 px-1.5 py-0.5 text-xs">
            {cotations.length}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="PLACEMENT"
          className={`gap-2 px-4 py-2 ${TAB_ACCENT.PLACEMENT.active}`}
        >
          <span className="font-medium">Placements</span>
          <span className="ml-1 rounded-md bg-background/70 px-1.5 py-0.5 text-xs">
            {placements.length}
          </span>
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