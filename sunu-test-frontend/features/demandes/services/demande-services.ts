import { mockDemandes } from "../data/mockDemandes";

export function getStats(type: "COTATION" | "PLACEMENT") {
  const now = new Date();

  const filtered = mockDemandes.filter((d) => d.type === type);

  const total = filtered.length;

  const enRetard = filtered.filter(
    (d) => new Date(d.delaiLimite) < now && d.statut !== "ACCEPTE"
  ).length;

  return { total, enRetard };
}