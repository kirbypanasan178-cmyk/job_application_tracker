import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  BarChart3,
  FileText,
  StickyNote,
  Bell,
  Settings,
  Bookmark,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type SidebarRoute =
  | "dashboard"
  | "applications"
  | "calendar"
  | "statistics"
  | "documents"
  | "notes"
  | "reminders"
  | "settings";

interface NavLinkConfig {
  route: SidebarRoute;
  label: string;
  icon: LucideIcon;
}

const NAV_LINKS: NavLinkConfig[] = [
  { route: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { route: "applications", label: "Applications", icon: Briefcase },
  { route: "calendar", label: "Calendar", icon: Calendar },
  { route: "statistics", label: "Statistics", icon: BarChart3 },
  { route: "documents", label: "Documents", icon: FileText },
  { route: "notes", label: "Notes", icon: StickyNote },
  { route: "reminders", label: "Reminders", icon: Bell },
  { route: "settings", label: "Settings", icon: Settings },
];

interface SidebarUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface SidebarProps {
  activeRoute: SidebarRoute;
  onNavigate: (route: SidebarRoute) => void;
  user: SidebarUser;
  onUpgradeClick: () => void;
}

export const Sidebar = ({ activeRoute, onNavigate, user, onUpgradeClick }: SidebarProps) => {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-100 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <Bookmark className="h-4.5 w-4.5 text-white" fill="white" />
        </div>
        <span className="text-lg font-semibold text-gray-900">
          Job<span className="text-indigo-600">Tracker</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV_LINKS.map(({ route, label, icon: Icon }) => (
          <SidebarNavLink
            key={route}
            label={label}
            icon={Icon}
            isActive={route === activeRoute}
            onClick={() => onNavigate(route)}
          />
        ))}
      </nav>

      {/* Premium promo */}
      <div className="mx-3 mb-4 rounded-xl bg-indigo-50 p-4">
        <Sparkles className="h-5 w-5 text-indigo-500" />
        <p className="mt-2 text-sm font-semibold text-gray-900">Stay organized</p>
        <p className="mt-0.5 text-xs text-gray-500">Track your job applications in one place.</p>
        <button
          type="button"
          onClick={onUpgradeClick}
          className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Go Premium
        </button>
      </div>

      {/* User profile */}
      <div className="flex items-center gap-3 border-t border-gray-100 px-4 py-4">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
          <p className="truncate text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
    </aside>
  );
};

interface SidebarNavLinkProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

const SidebarNavLink = ({ label, icon: Icon, isActive, onClick }: SidebarNavLinkProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon className="h-4.5 w-4.5" />
      {label}
    </button>
  );
};