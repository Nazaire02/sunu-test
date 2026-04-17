"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="h-16 w-16 text-destructive" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Page Non Trouvée</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <Link
            href="/"
            className="inline-flex items-center bg-gradient-primary text-primary-foreground hover:opacity-90 hover:scale-105 transition-all rounded-md px-6 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Retourner à la page d'accueil"
          >
            Retourner à l'accueil
          </Link>
        </div>
      </main>
    </div>
  );
}