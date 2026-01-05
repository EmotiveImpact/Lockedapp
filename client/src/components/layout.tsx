import { Link, useLocation } from "wouter";
import { Home, Users, Compass, User, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHabits } from "@/hooks/use-habits";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "@/pages/dashboard";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isQuickActionOpen, setQuickActionOpen } = useHabits();

  // Quick Action (task screen) uses a “sheet” transition (slides up slightly + fades).
  // The bottom nav remains visible above the overlay.

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/social", icon: Users, label: "Community" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl border-x border-border/50">
        {/* Glow Effects - Base layer */}
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-primary/10 blur-[100px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-primary/5 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Main content - z-10 */}
      <main className="relative z-10 flex-1 overflow-y-auto no-scrollbar">
        {children}
      </main>

      {/* Quick Action Overlay (Dashboard) - z-[100] to z-[109] */}
      <AnimatePresence>
        {isQuickActionOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 z-[100] max-w-md mx-auto"
          >
            {/* Backdrop - z-[101] */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              data-testid="quick-action-backdrop"
              className="absolute inset-0 z-[101] bg-black/60 backdrop-blur-sm"
              onClick={() => setQuickActionOpen(false)}
            />

            {/* Lightning / energy flash - z-[102] */}
            <motion.div
              key="quick-action-lightning"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: [0, 0.9, 0], scale: [0.75, 1.25, 1.55] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, times: [0, 0.25, 1], ease: "easeOut" }}
              data-testid="quick-action-lightning"
              className="pointer-events-none absolute left-1/2 bottom-[92px] -translate-x-1/2 w-[560px] h-[560px] z-[102] mix-blend-screen bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.40),rgba(204,255,0,0.10)_25%,transparent_60%)]"
            />

            {/* Sheet content - z-[105] */}
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.99, borderRadius: 28 }}
              animate={{ opacity: 1, y: 0, scale: 1, borderRadius: 28 }}
              exit={{ opacity: 0, y: 18, scale: 0.99, borderRadius: 28 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              style={{ left: 0, right: 0, top: 0, bottom: 0 }}
              data-testid="quick-action-overlay"
              className="absolute z-[105] bg-background overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="h-full overflow-y-auto no-scrollbar pb-28 relative z-[106]">
                <Dashboard />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar - z-[200] */}
      <nav data-testid="bottom-mobile-nav" className="fixed bottom-0 left-0 right-0 z-[200] flex justify-center pointer-events-none">
        <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border-t border-white/5 pb-6 pt-2 px-6 flex justify-between items-center pointer-events-auto">
          {navItems.map((item, idx) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a 
                  data-testid={`bottom-mobile-nav-link-${item.label.toLowerCase()}`}
                  onClick={() => setQuickActionOpen(false)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 w-16 h-14 transition-all duration-300 group",
                    isActive && !isQuickActionOpen ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    idx === 1 && "mr-8",
                    idx === 2 && "ml-8"
                  )}
                >
                  <item.icon 
                    size={24} 
                    strokeWidth={isActive && !isQuickActionOpen ? 2.5 : 2}
                    className={cn(
                        "transition-transform duration-300",
                        isActive && !isQuickActionOpen && "scale-110 drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]"
                    )}
                  />
                </a>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Center Plus Button - z-[210] (Above nav) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[210]">
          <button 
            data-testid="bottom-nav-center-action-button"
            onClick={() => setQuickActionOpen(!isQuickActionOpen)}
            className={cn(
              "h-14 w-14 bg-black border-2 border-white/10 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95",
              isQuickActionOpen ? "text-destructive border-destructive" : "text-primary border-primary"
            )}
          >
              <AnimatePresence mode="wait">
                {isQuickActionOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X size={32} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plus"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Plus size={32} />
                  </motion.div>
                )}
              </AnimatePresence>
          </button>
      </div>
    </div>
  );
}
