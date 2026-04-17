export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b py-3 last:border-b-0">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm text-foreground">{children}</div>
    </div>
  );
}