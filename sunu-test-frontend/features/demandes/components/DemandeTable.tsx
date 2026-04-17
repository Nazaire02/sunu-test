import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import type { Demande, DemandeType } from "../data/mockDemandes";
import { formatMontant } from "@/lib/demandes";
import { StatutBadge } from "./StatutBadge";
import { DelaiCell } from "./DetailCell";
import Link from "next/link";

interface DemandeTableProps {
    demandes: Demande[];
    type: DemandeType;
}

const ACCENT: Record<DemandeType, { border: string; mobileBorder: string }> = {
    COTATION: {
        border: "border-l-4 border-l-blue-500",
        mobileBorder: "border-l-4 border-l-blue-500",
    },
    PLACEMENT: {
        border: "border-l-4 border-l-purple-500",
        mobileBorder: "border-l-4 border-l-purple-500",
    },
};

export function DemandeTable({ demandes, type }: DemandeTableProps) {
    const accent = ACCENT[type];

    return (
        <>
            {/* Desktop table */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Référence</TableHead>
                            <TableHead>Contrat source</TableHead>
                            <TableHead>Type de demande</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Réassureur</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                            <TableHead>Délai limite</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {demandes.map((d) => (
                            <TableRow key={d.id} className={accent.border}>
                                <TableCell>
                                    <Link
                                        href={`/demandes/${d.id}`}
                                        className="font-medium text-primary underline-offset-4 hover:underline"
                                    >
                                        {d.id}
                                    </Link>
                                </TableCell>
                                <TableCell className="font-mono text-sm">{d.contratId}</TableCell>
                                <TableCell>
                                    <StatutBadge statut={d.type} />
                                </TableCell>
                                <TableCell>
                                    <StatutBadge statut={d.statut} />
                                </TableCell>
                                <TableCell>
                                    {d.reassureur ? (
                                        <span>{d.reassureur}</span>
                                    ) : (
                                        <span className="italic text-muted-foreground">Non assigné</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-medium tabular-nums">
                                    {formatMontant(d.montant, d.devise)}
                                </TableCell>
                                <TableCell>
                                    <DelaiCell dateStr={d.delaiLimite} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
                {demandes.map((d) => (
                    <Link
                        key={d.id}
                        href="/demandes/{d.id}"
                        className={`block rounded-lg border bg-card p-4 shadow-sm ${accent.mobileBorder}`}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="font-semibold text-primary">{d.id}</div>
                                <div className="font-mono text-xs text-muted-foreground">{d.contratId}</div>
                            </div>
                            <StatutBadge statut={d.statut} />
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <div className="text-xs text-muted-foreground">Réassureur</div>
                                <div>
                                    {d.reassureur ?? (
                                        <span className="italic text-muted-foreground">Non assigné</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground">Montant</div>
                                <div className="font-medium tabular-nums">
                                    {formatMontant(d.montant, d.devise)}
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 border-t pt-3">
                            <div className="mb-1 text-xs text-muted-foreground">Délai limite</div>
                            <DelaiCell dateStr={d.delaiLimite} />
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}