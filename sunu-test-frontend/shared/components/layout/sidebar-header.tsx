import { ShieldCheck } from "lucide-react";

interface SidebarHeaderProps {
  isOpen: boolean;
}

export default function SidebarHeader({ isOpen }: Readonly<SidebarHeaderProps>) {
  return (
    <div className="py-4 flex items-center justify-between">
      {isOpen && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Réassurance</p>
          </div>
        </div>
      )}
    </div>
  );
}