import Link from "next/link";
import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="flex items-center justify-end px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher ..."
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Rechercher commandes clients"
              />
            </div>
          </div>
          <button
            className="relative p-2 hover:bg-muted rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}