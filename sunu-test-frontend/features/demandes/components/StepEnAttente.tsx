import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { User, Percent, DollarSign, Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export function StepEnAttente({ form, onSubmit }: { form: UseFormReturn<any>, onSubmit: any }) {
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <Label>Nom du réassureur</Label>
                    <div className="relative">
                        <Input
                            {...form.register("reassureur", { valueAsNumber: false })} className="pl-12" placeholder="Ex: AXA Ré"
                            leftIcon={<User className="h-5 w-5" />}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Taux proposé (%)</Label>
                    <div className="relative">
                        <Input
                            type="number" step="0.01" {...form.register("taux", { valueAsNumber: true })} className="pl-12"
                            leftIcon={<Percent className="h-5 w-5" />}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Montant de la prime (FCFA)</Label>
                    <div className="relative">
                        <Input type="number" {...form.register("prime", { valueAsNumber: true })} className="pl-12"
                            leftIcon={<DollarSign className="h-5 w-5" />}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Validité de l'offre (jours)</Label>
                    <div className="relative">
                        <Input type="number" {...form.register("validite", { valueAsNumber: true })} className="pl-12"
                            leftIcon={<Calendar className="h-5 w-5" />}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Commentaire <span className="text-muted-foreground">(optionnel)</span></Label>
                <Textarea {...form.register("commentaire")} rows={4} placeholder="Informations supplémentaires..." />
            </div>

            <Button type="submit" size="lg" className="w-full text-lg h-12 bg-gradient-to-r from-green-600 to-green-600 hover:green-110">
                Enregistrer la réponse tarifaire
            </Button>
        </form>
    );
}