import DesktopDashboard from "@/components/desktop-dashboard";
import MobileHome from "@/components/mobile-home";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Desktop Dashboard - Visible on LG screens ONLY */}
      <div className="hidden lg:block p-8 pt-4">
        <DesktopDashboard />
      </div>

      {/* Mobile Home View - Hidden on LG screens */}
      <div className="lg:hidden">
        <MobileHome />
      </div>
    </div>
  );
}
