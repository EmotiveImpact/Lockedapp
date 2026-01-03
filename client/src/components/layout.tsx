import { Link, useLocation } from "wouter";
import { Home, Users, Compass, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/social", icon: Users, label: "Community" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl border-x border-border/50">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        {children}
      </main>

      {/* Center Plus Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60]">
          <button className="h-14 w-14 bg-black border-2 border-white/10 rounded-full flex items-center justify-center text-primary shadow-2xl hover:scale-110 transition-transform">
              <Plus size={32} />
          </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border-t border-white/5 pb-6 pt-2 px-6 flex justify-between items-center pointer-events-auto">
          {navItems.map((item, idx) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex flex-col items-center justify-center gap-1 w-16 h-14 transition-all duration-300 group",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  idx === 1 && "mr-8",
                  idx === 2 && "ml-8"
                )}>
                  <item.icon 
                    size={24} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className={cn(
                        "transition-transform duration-300",
                        isActive && "scale-110 drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]"
                    )}
                  />
                  <span className={cn(
                      "text-[10px] uppercase font-bold tracking-wider transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    {item.label}
                  </span>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
