export type DemandeType = "COTATION" | "PLACEMENT";

export type DemandeStatut =
  | "EN_ATTENTE"
  | "EN_COURS_VALIDATION"
  | "REPONSE_RECUE"
  | "TRANSMIS_REASSUREUR"
  | "ACCEPTE"
  | "REFUSE"
  | "EXPIRE"
  | "COTATION"
  | "PLACEMENT";

export interface Demande {
  id: string;
  contratId: string;
  type: DemandeType;
  statut: DemandeStatut;
  delaiLimite: string; 
  reassureur: string | null;
  montant: number;
  devise: string;
}

export const mockDemandes: Demande[] = [
  {
    id: "DR-2025-001",
    contratId: "CTR-2025-00847",
    type: "COTATION",
    statut: "EN_ATTENTE",
    delaiLimite: "2026-06-03",
    reassureur: null,
    montant: 350000000,
    devise: "FCFA",
  },
  {
    id: "DR-2025-002",
    contratId: "CTR-2025-00751",
    type: "PLACEMENT",
    statut: "EN_COURS_VALIDATION",
    delaiLimite: "2025-06-12",
    reassureur: "SCOR SE",
    montant: 820000000,
    devise: "FCFA",
  },
  {
    id: "DR-2025-003",
    contratId: "CTR-2025-00612",
    type: "COTATION",
    statut: "REPONSE_RECUE",
    delaiLimite: "2025-05-28",
    reassureur: "Munich Re",
    montant: 210000000,
    devise: "FCFA",
  },
  {
    id: "DR-2025-004",
    contratId: "CTR-2025-00590",
    type: "PLACEMENT",
    statut: "ACCEPTE",
    delaiLimite: "2025-05-20",
    reassureur: "Swiss Re",
    montant: 1200000000,
    devise: "FCFA",
  },
  {
    id: "DR-2025-005",
    contratId: "CTR-2025-00433",
    type: "COTATION",
    statut: "EXPIRE",
    delaiLimite: "2025-05-15",
    reassureur: "AXA RE",
    montant: 275000000,
    devise: "FCFA",
  },
  {
    id: "DR-2025-006",
    contratId: "CTR-2025-00388",
    type: "PLACEMENT",
    statut: "TRANSMIS_REASSUREUR",
    delaiLimite: "2025-06-18",
    reassureur: "Hannover Re",
    montant: 950000000,
    devise: "FCFA",
  },
];