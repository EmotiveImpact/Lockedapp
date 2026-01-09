import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Compass, 
  User, 
  Settings, 
  LogOut, 
  MessageSquare,
  Moon,
  Sun,
  Box,
  ShoppingBag,
  TrendingUp,
  Megaphone,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface SidebarItemProps {
  href: string;
  icon: any;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}

function SidebarItem({ href, icon: Icon, label, active, collapsed }: SidebarItemProps) {
  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 cursor-pointer group relative",
        active 
          ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(204,255,0,0.05)]" 
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      )}>
        <Icon size={20} className={cn(
          "transition-transform duration-300",
          active && "scale-110 drop-shadow-[0_0_8px_rgba(204,255,0,0.4)]"
        )} />
        {!collapsed && <span className="font-display font-black uppercase tracking-widest text-[10px]">{label}</span>}
        
        {active && (
          <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-8 bg-primary rounded-full blur-[4px]" />
        )}
      </div>
    </Link>
  );
}

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  const primaryNav = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/social", icon: Users, label: "Community" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const productNav = [
    { href: "/products", icon: Box, label: "Products" },
    { href: "/shop", icon: ShoppingBag, label: "Shop" },
    { href: "/income", icon: TrendingUp, label: "Income" },
    { href: "/promote", icon: Megaphone, label: "Promote" },
  ];

  return (
    <aside className={cn(
      "h-screen sticky top-0 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col p-6 transition-all duration-500 z-50",
      collapsed ? "w-24" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.3)]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-black">
            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
          </svg>
        </div>
        {!collapsed && <span className="text-xl font-display font-black italic tracking-tighter uppercase italic leading-none">LOCKED IN</span>}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
        <div>
          {!collapsed && <p className="px-4 mb-4 text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">General</p>}
          <div className="space-y-1">
            {primaryNav.map((item) => (
              <SidebarItem 
                key={item.href} 
                {...item} 
                active={location === item.href} 
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>

        <div>
          {!collapsed && <p className="px-4 mb-4 text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">System</p>}
          <div className="space-y-1">
            {productNav.map((item) => (
              <SidebarItem 
                key={item.href} 
                {...item} 
                active={location === item.href} 
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto space-y-2 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <MessageSquare size={20} />
          </div>
          <div className="p-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <Moon size={20} />
          </div>
          <div 
            onClick={() => logoutMutation.mutate()}
            className="p-3 text-destructive hover:scale-110 cursor-pointer transition-all ml-auto"
          >
            <LogOut size={20} />
          </div>
        </div>
      </div>
    </aside>
  );
}
