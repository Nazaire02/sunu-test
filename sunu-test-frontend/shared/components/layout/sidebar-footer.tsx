import React from "react";
import { LogOut } from "lucide-react";

interface SidebarFooterProps {
  isOpen: boolean;
  setConfirmLogout: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SidebarFooter({ 
  isOpen, 
  setConfirmLogout 
}: Readonly<SidebarFooterProps>) {
  return (
    <div className="p-4 border-t border-sidebar-border mt-auto">
      <button
        className={`
          w-full h-14 flex items-center justify-center gap-3 
          bg-destructive active:bg-red-700
          text-white font-semibold text-base
          rounded-2xl transition-all duration-200
          active:scale-[0.97] focus-visible:outline-none 
          focus-visible:ring-4 focus-visible:ring-red-500/30
          shadow-md hover:shadow-lg
          ${isOpen ? 'px-6' : 'px-3'}
        `}
        title="Déconnexion"
      >
        <LogOut size={24} strokeWidth={2.75} />
        
        {isOpen && (
          <span>Déconnexion</span>
        )}
      </button>
    </div>
  );
}