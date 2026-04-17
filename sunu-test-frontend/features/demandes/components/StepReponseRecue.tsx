import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

export function StepReponseRecue({
    data,
    onAccept,
    onRefuse,
    showRefus,
    setShowRefus,
    motif,
    setMotif
}: any) {
    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-2xl p-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Réassureur</p>
                    <p className="text-2xl font-semibold mt-2">{data.reassureur}</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Taux</p>
                    <p className="text-4xl font-semibold mt-2 text-violet-600">{data.taux}%</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Prime</p>
                    <p className="text-2xl font-semibold mt-2">{data.prime.toLocaleString()} FCFA</p>
                </div>
            </div>

            <div className="flex gap-4">
                <Button onClick={onAccept} size="lg" className="flex-1 h-16 text-lg bg-emerald-600 hover:bg-emerald-700">
                    Accepter le tarif
                </Button>
                <Button
                    onClick={() => setShowRefus(true)}
                    variant="destructive"
                    size="lg"
                    className="flex-1 h-16 text-lg"
                >
                    Refuser le tarif
                </Button>
            </div>

            {showRefus && (
                <div className="mt-8 p-8 border border-red-200 dark:border-red-900 rounded-3xl bg-red-50/50 dark:bg-red-950/30">
                    <Label className="text-red-700 dark:text-red-400">Motif de refus *</Label>
                    <Textarea
                        value={motif}
                        onChange={(e) => setMotif(e.target.value)}
                        rows={4}
                        className="mt-3"
                        placeholder="Expliquez la raison du refus..."
                    />
                    <Button onClick={onRefuse} disabled={!motif.trim()} className="mt-6 w-full" variant="destructive">
                        Confirmer le refus
                    </Button>
                </div>
            )}
        </div>
    );
}