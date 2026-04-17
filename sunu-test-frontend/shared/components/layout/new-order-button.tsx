import Link from "next/link";
import { Plus } from "lucide-react";

export default function NewOrderButton() {
  return (
    <div className="mb-6 p-4">
      <Link
        href="/orders/new"
        className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center rounded-md px-4 py-2 text-[1rem] font-medium focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nouvelle Commande
      </Link>
    </div>
  );
}