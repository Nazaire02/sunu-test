import { MenuGroup } from "@/shared/types/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationMenuProps {
  menuItems: MenuGroup[];
  isSidebarOpen: boolean;
}

export default function NavigationMenu({ menuItems, isSidebarOpen }: Readonly<NavigationMenuProps>) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-4" aria-label="Main navigation">
      {menuItems.map((group, groupIndex) => (
        <div key={`group-${groupIndex + 1}`} className="space-y-2">
          {isSidebarOpen && (
            <h3 className="text-[1.1rem] font-semibold text-muted-foreground uppercase tracking-wide px-4">
              {group.groupTitle}
            </h3>
          )}
          {group.items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.url}
                href={item.url}
                className={`w-full text-[1rem] flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                  pathname === item.url
                    ? "bg-red-500 text-primary-foreground shadow-elegant"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:shadow-elegant hover:scale-[1.02]"
                } focus:outline-none focus:ring-2 focus:ring-ring`}
                aria-current={pathname === item.url ? "page" : undefined}
              >
                <Icon size={20} />
                {isSidebarOpen && <span>{item.title}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}