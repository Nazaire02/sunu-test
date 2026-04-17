import { CheckCircle2 } from "lucide-react";

const steps = [
  { id: 1, title: "Demande émise", description: "Soumission initiale" },
  { id: 2, title: "Réponse reçue", description: "Tarif du réassureur" },
  { id: 3, title: "Décision prise", description: "Acceptation ou refus" },
];

export function CotationStepper({ currentStep }: { currentStep: number }) {
  return (
                <div className="mb-12">
                    <div className="flex justify-between items-center relative">
                        {steps.map((step, index) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;
                            return (
                                <div key={step.id} className="flex flex-col items-center relative flex-1">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border-4
                    ${isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                                            isActive ? "bg-white border-green-600" :
                                                "bg-white border-zinc-200 dark:border-zinc-700"}`}>
                                        {isCompleted ? <CheckCircle2 className="w-7 h-7" /> :
                                            <span className="text-xl font-semibold">{step.id}</span>}
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className={`font-semibold ${isActive ? "text-green-600" : ""}`}>
                                            {step.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="absolute top-7 left-0 right-0 h-0.5 bg-green-200 -z-10" />
                    </div>
                </div>
  );
}