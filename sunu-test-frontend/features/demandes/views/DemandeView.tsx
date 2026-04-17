import { DemandeList } from "@/features/demandes/components/DemandeList";

export default function DemandeView() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Suivez et pilotez vos demandes de réassurance. Les{" "}
          <span className="font-medium text-blue-700">cotations</span> et{" "}
          <span className="font-medium text-purple-700">placements</span> sont organisés
          dans des onglets distincts.
        </p>
      </div>
      <DemandeList />
    </div>
  );
};