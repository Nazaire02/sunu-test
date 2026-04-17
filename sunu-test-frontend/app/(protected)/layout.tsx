"use client";

import Sidebar from "@/shared/components/layout/sidebar";
import "../globals.css";
import Header from "@/shared/components/layout/header";
import { useMenuItems } from "@/shared/data/menu.data";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = useMenuItems()


  return (
    <div className="flex h-screen">
      <Sidebar menuItems={menuItems} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-sidebar-background">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
