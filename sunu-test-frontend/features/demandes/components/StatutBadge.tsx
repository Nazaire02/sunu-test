import { Badge } from "@/shared/components/ui/badge";
import { DemandeStatut } from "../data/mockDemandes";

const STATUT_LABEL: Record<DemandeStatut, string> = {
  EN_ATTENTE: "En attente",
  EN_COURS_VALIDATION: "En cours de validation",
  REPONSE_RECUE: "Réponse reçue",
  TRANSMIS_REASSUREUR: "Transmis réassureur",
  ACCEPTE: "Accepté",
  REFUSE: "Refusé",
  EXPIRE: "Expiré",
  COTATION: "Cotation",
  PLACEMENT: "Placement",
};

const STATUT_CLASSES: Record<DemandeStatut, string> = {
  EN_ATTENTE: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
  EN_COURS_VALIDATION: "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200",
  REPONSE_RECUE: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
  TRANSMIS_REASSUREUR: "bg-blue-200 text-blue-900 hover:bg-blue-200 border-blue-300",
  ACCEPTE: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
  REFUSE: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
  EXPIRE: "bg-red-200 text-red-900 hover:bg-red-200 border-red-300",
  COTATION: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
  PLACEMENT: "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200",
};

export function StatutBadge({ statut }: { statut: DemandeStatut }) {
  return (
    <Badge variant="outline" className={`font-medium ${STATUT_CLASSES[statut]}`}>
      {STATUT_LABEL[statut]}
    </Badge>
  );
}

export { STATUT_LABEL };