"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarHeader from "./sidebar-header";
import NavigationMenu from "./navigation-menu";
import SidebarFooter from "./sidebar-footer";
import { MenuGroup } from "@/shared/types/menu";
import { ConfirmationDialog } from "../confirm-modal";

interface SidebarProps {
  menuItems: MenuGroup[];
}

export default function Sidebar({ menuItems }: Readonly<SidebarProps>) {
  const [isOpen, setIsOpen] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false)

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-20"
        } border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground transition-all duration-300 ease-in-out flex flex-col`}
      aria-label="Sidebar navigation"
    >
      <ConfirmationDialog
        open={confirmLogout}
        onOpenChange={setConfirmLogout}
        title="Confirmer la déconnexion"
        description="Êtes-vous sûr de vouloir vous déconnecter ?"
        onConfirm={() => {
          console.log("Déconnexion confirmée")
        }}
      />
      <div className="flex flex-col h-full">
        <div className={`flex items-center ${isOpen ? "justify-between" : "justify-center"} px-4 my-2`}>
          <SidebarHeader isOpen={isOpen} />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <NavigationMenu menuItems={menuItems} isSidebarOpen={isOpen} />
        <SidebarFooter isOpen={isOpen} setConfirmLogout={setConfirmLogout} />
      </div>
    </aside>
  );
}