export interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ size?: number }>;
}

export interface MenuGroup {
  groupTitle: string;
  items: MenuItem[];
}