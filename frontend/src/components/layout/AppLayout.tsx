import { type ReactNode } from "react";
import { Sidebar, type SidebarRoute } from "./Sidebar";

interface AppLayoutProps {
  activeRoute: SidebarRoute;
  children: ReactNode;
}

// TODO: replace with real logged-in user data (from auth context/store)
const CURRENT_USER = {
  name: "John Doe",
  email: "john.doe@example.com",
};

export const AppLayout = ({ activeRoute, children }: AppLayoutProps) => {
  const handleNavigate = (route: SidebarRoute) => {
    // TODO: wire to your router, e.g. navigate(`/${route}`)
    console.log("navigate to", route);
  };

  const handleUpgradeClick = () => {
    // TODO: open upgrade/premium modal or navigate to pricing page
    console.log("upgrade clicked");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        user={CURRENT_USER}
        onUpgradeClick={handleUpgradeClick}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};