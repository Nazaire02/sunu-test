import { CheckCircle2 } from "lucide-react";

export function StepAccepte({ data }: any) {
    return (
        <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-600" />
            </div>
            <h2 className="text-4xl font-bold mt-8">Tarif Accepté</h2>
            <p className="text-muted-foreground mt-3">La cotation a été validée avec succès</p>

            <div className="max-w-md mx-auto mt-10 space-y-6 text-left">
                <div className="flex justify-between py-4 border-b">
                    <span className="text-muted-foreground">Réassureur</span>
                    <span className="font-medium">{data.reassureur}</span>
                </div>
                <div className="flex justify-between py-4 border-b">
                    <span className="text-muted-foreground">Taux accepté</span>
                    <span className="font-medium text-emerald-600">{data.taux}%</span>
                </div>
                <div className="flex justify-between py-4 border-b">
                    <span className="text-muted-foreground">Prime</span>
                    <span className="font-medium">{data.prime.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between py-4">
                    <span className="text-muted-foreground">Date de décision</span>
                    <span className="font-medium">{new Date(data.date).toLocaleDateString('fr-FR')}</span>
                </div>
            </div>
        </div>
    );
}