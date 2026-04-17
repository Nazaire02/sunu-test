"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, AlertTriangle, User, Percent, DollarSign, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { mockDemandes } from "@/features/demandes/data/mockDemandes";
import { StepEnAttente } from "../components/StepEnAttente";
import { StepReponseRecue } from "../components/StepReponseRecue";
import { StepAccepte } from "../components/StepAccepte";
import { StepRefuse } from "../components/StepRefuse";
import { CotationStepper } from "../components/CotationStepper";

const formSchema = z.object({
    reassureur: z.string().min(1, "Nom du réassureur requis"),
    taux: z.number().min(0.01).max(100),
    prime: z.number().int().positive(),
    validite: z.number().int().min(1).max(90),
    commentaire: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
    { id: 1, title: "Demande émise", description: "Soumission initiale" },
    { id: 2, title: "Réponse reçue", description: "Tarif du réassureur" },
    { id: 3, title: "Décision prise", description: "Acceptation ou refus" },
];

export default function DemandeWorkflow() {
    const params = useParams();
    const router = useRouter();
    const [demande, setDemande] = useState(mockDemandes.find(d => d.id === params.id));
    const [currentStep, setCurrentStep] = useState(1);
    const [status, setStatus] = useState<"EN_ATTENTE" | "REPONSE_RECUE" | "ACCEPTE" | "REFUSE" | "EXPIRE">("EN_ATTENTE");
    const [reponseData, setReponseData] = useState<any>(null);
    const [motifRefus, setMotifRefus] = useState("");
    const [showRefusInput, setShowRefusInput] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reassureur: "",
            taux: 0,
            prime: 0,
            validite: 30,
            commentaire: "",
        },
    });

    useEffect(() => {
        if (!demande) return;

        const interval = setInterval(() => {
            const now = new Date();
            const limit = new Date(demande.delaiLimite);
            const diff = limit.getTime() - now.getTime();

            if (diff <= 0) {
                setStatus("EXPIRE");
                setTimeLeft("Expiré");
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                setTimeLeft(`${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [demande]);

    const handleSubmitTarif = async (values: FormValues) => {
        await new Promise(resolve => setTimeout(resolve, 600));

        const newData = {
            ...values,
            date: new Date().toISOString(),
        };

        setReponseData(newData);
        setStatus("REPONSE_RECUE");
        setCurrentStep(2);
    };

    const handleAccept = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        setStatus("ACCEPTE");
        setCurrentStep(3);
    };

    const handleRefuse = async () => {
        if (!motifRefus.trim()) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        setStatus("REFUSE");
        setCurrentStep(3);
    };

    if (!demande) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold">Demande introuvable</h1>
                    <Button onClick={() => router.back()} className="mt-4">Retour</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="pl-0">
                    <ArrowLeft className="mr-2 h-5 w-5" /> Retour
                </Button>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="font-mono">{demande.id}</Badge>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">{timeLeft}</span>
                    </div>
                </div>
            </div>
            <div>
                <CotationStepper currentStep={currentStep} />

                {status === "EXPIRE" && (
                    <div className="mb-8 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-2xl p-5 flex gap-4">
                        <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-700 dark:text-red-400">Délai dépassé</h3>
                            <p className="text-sm text-red-600 dark:text-red-500">Cette demande a expiré. Aucune action n'est possible.</p>
                        </div>
                    </div>
                )}

                <Card>
                    <CardHeader className="bg-gradient-to-r from-zinc-50 to-white  border-b py-8">
                        <CardTitle className="text-2xl">Workflow de Cotation</CardTitle>
                    </CardHeader>

                    <CardContent className="p-10">
                        {status === "EN_ATTENTE" && (
                            <StepEnAttente form={form} onSubmit={handleSubmitTarif} />
                        )}
                        {status === "REPONSE_RECUE" && reponseData && (
                            <StepReponseRecue
                                data={reponseData}
                                onAccept={handleAccept}
                                onRefuse={handleRefuse}
                                showRefus={showRefusInput}
                                setShowRefus={setShowRefusInput}
                                motif={motifRefus}
                                setMotif={setMotifRefus}
                            />
                        )}

                        {status === "ACCEPTE" && reponseData && (
                            <StepAccepte data={reponseData} />
                        )}

                        {status === "REFUSE" && (
                            <StepRefuse motif={motifRefus} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}