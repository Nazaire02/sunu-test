"use client";

import { AlertCircle } from "lucide-react";
import { CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

interface GlobalErrorDisplayProps {
  title?: string;
  description?: string;
  retry?: () => void;
  retryText?: string;
  className?: string;
}

export const GlobalErrorDisplay = ({
  title = "Une erreur est survenue",
  description = "Quelque chose s'est mal passé. Veuillez réessayer plus tard.",
  retry,
  retryText = "Réessayer",
  className = "",
}: GlobalErrorDisplayProps) => {
  return (
    <div className={`flex items-center justify-center min-h-[400px] p-4 ${className}`}>
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl text-red-800">{title}</h2>
        </div>
        <CardContent className="text-center space-y-6">
          <p className="text-base text-muted-foreground">
            {description}
          </p>
          {retry && (
            <Button onClick={retry} variant="destructive" size="lg">
              {retryText}
            </Button>
          )}
        </CardContent>
      </div>
    </div>
  );
};