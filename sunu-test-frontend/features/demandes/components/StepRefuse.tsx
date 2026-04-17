import { AlertTriangle } from "lucide-react";

export function StepRefuse({ motif }: { motif: string }) {
    return (
        <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-14 h-14 text-red-600" />
            </div>
            <h2 className="text-4xl font-bold mt-8 text-red-600">Tarif Refusé</h2>
            <div className="mt-10 max-w-lg mx-auto bg-zinc-50 dark:bg-zinc-800 p-8 rounded-3xl">
                <p className="font-medium text-left">Motif de refus :</p>
                <p className="mt-4 text-left leading-relaxed">{motif}</p>
            </div>
        </div>
    );
}