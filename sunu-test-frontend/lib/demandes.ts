import { Demande } from "@/features/demandes/data/mockDemandes";

export type Urgency = "expired" | "soon" | "ok";

export function formatMontant(n: number, devise: string): string {
  const formatted = new Intl.NumberFormat("fr-FR").format(n);
  const normalized = formatted.replace(/[\u202F\u2009]/g, "\u00A0");
  return `${normalized}\u00A0${devise}`;
}

export function formatDelai(dateStr: string): string {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function getUrgency(dateStr: string, now: Date = new Date()): Urgency {
  const deadline = new Date(dateStr);
  deadline.setHours(23, 59, 59, 999);
  const diffMs = deadline.getTime() - now.getTime();
  if (diffMs < 0) return "expired";
  const fortyEightHoursMs = 48 * 60 * 60 * 1000;
  if (diffMs <= fortyEightHoursMs) return "soon";
  return "ok";
}

export type SortKey = "delai_asc" | "montant_desc" | "montant_asc";

export function sortDemandes(list: Demande[], key: SortKey): Demande[] {
  const copy = [...list];
  switch (key) {
    case "delai_asc":
      return copy.sort(
        (a, b) => new Date(a.delaiLimite).getTime() - new Date(b.delaiLimite).getTime(),
      );
    case "montant_desc":
      return copy.sort((a, b) => b.montant - a.montant);
    case "montant_asc":
      return copy.sort((a, b) => a.montant - b.montant);
  }
}