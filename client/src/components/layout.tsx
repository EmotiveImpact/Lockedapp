import { Link, useLocation } from "wouter";
import { Home, Users, Compass, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Sidebar from "./sidebar";
import DesktopHeader from "./desktop-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/social", icon: Users, label: "Community" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col lg:flex-row relative overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden lg:block">
          <DesktopHeader />
        </div>

        {/* Mobile Layout Wrapper (constrained) */}
        <div className={cn(
          "flex-1 flex flex-col relative w-full",
          "max-w-md mx-auto lg:max-w-none lg:mx-0 border-x border-border/50 lg:border-x-0 overflow-hidden"
        )}>
          {/* Glow Effects - Base layer */}
          <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-primary/10 blur-[100px] rounded-full pointer-events-none z-0" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-primary/5 blur-[100px] rounded-full pointer-events-none z-0" />

          {/* Main content - z-10 */}
          <main className="relative z-10 flex-1 overflow-y-auto no-scrollbar pb-32 lg:pb-8">
            {children}
          </main>

          {/* Bottom Navigation Bar - Mobile ONLY */}
          <nav data-testid="bottom-mobile-nav" className="fixed bottom-0 left-0 right-0 z-[200] flex justify-center pointer-events-none lg:hidden">
            <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border-t border-white/5 pb-6 pt-2 px-6 flex justify-between items-center pointer-events-auto">
              {navItems.map((item, idx) => {
                const isActive = location === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    data-testid={`bottom-mobile-nav-link-${item.label.toLowerCase()}`}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 w-16 h-14 transition-all duration-300 group",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                      idx === 1 && "mr-8",
                      idx === 2 && "ml-8"
                    )}
                  >
                    <item.icon 
                      size={24} 
                      strokeWidth={isActive ? 2.5 : 2}
                      className={cn(
                          "transition-transform duration-300",
                          isActive && "scale-110 drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]"
                      )}
                    />
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Center Plus Button - Mobile ONLY */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[210] lg:hidden">
            <Link 
              href="/tasks"
              data-testid="bottom-nav-center-action-button"
              className={cn(
                "h-14 w-14 bg-black border-2 border-white/10 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95",
                location === "/tasks" ? "text-primary border-primary" : "text-primary border-primary"
              )}
            >
              <Plus size={32} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
