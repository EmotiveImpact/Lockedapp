import { useHabits } from "@/hooks/use-habits";
import { Settings, ChevronRight, Bell, Moon, Volume2, Shield, Mail, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useHabits();

  const sections = [
    {
      title: "Account",
      icon: UserIcon,
      items: [
        { label: "Profile", icon: UserIcon },
        { label: "Email", icon: Mail },
        { label: "Password", icon: Lock },
      ]
    },
    {
      title: "Preferences",
      icon: Settings,
      items: [
        { label: "Notifications", icon: Bell, type: "switch" },
        { label: "Dark Mode", icon: Moon, type: "switch" },
        { label: "Sound Effects", icon: Volume2, type: "switch" },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full pb-32 bg-black">
       {/* Unified Header */}
       <header className="p-8 pt-12 border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-40">
        <h1 className="text-5xl font-display font-black tracking-tighter italic">PROFILE</h1>
        <p className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-black mt-1">DISCIPLINE IS FREEDOM</p>
      </header>

      <div className="p-6 space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 flex items-center gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 blur-[60px] translate-x-1/2" />
            <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-2xl">
                    <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" />
                    <AvatarFallback>LU</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full border-2 border-background shadow-lg">
                    LVL {user.level}
                </div>
            </div>
            <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight">LOCKED IN USER</h2>
                <p className="text-primary text-[10px] uppercase font-black tracking-widest mt-1 italic">Member since 2026</p>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 grid grid-cols-3 divide-x divide-white/10 shadow-xl">
            <div className="text-center px-2">
                <div className="text-primary text-3xl font-display font-black leading-none mb-1 drop-shadow-[0_0_8px_rgba(204,255,0,0.3)]">480</div>
                <div className="text-muted-foreground text-[8px] uppercase font-black tracking-[0.2em] opacity-40">Total XP</div>
            </div>
            <div className="text-center px-2">
                <div className="text-white text-3xl font-display font-black leading-none mb-1">0</div>
                <div className="text-muted-foreground text-[8px] uppercase font-black tracking-[0.2em] opacity-40">Sprints</div>
            </div>
            <div className="text-center px-2">
                <div className="text-white text-3xl font-display font-black leading-none mb-1">{user.streak}</div>
                <div className="text-muted-foreground text-[8px] uppercase font-black tracking-[0.2em] opacity-40">Days</div>
            </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-12">
            {sections.map((section) => (
                <div key={section.title} className="space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <section.icon size={16} className="text-primary opacity-50" />
                        <h3 className="font-black uppercase tracking-[0.4em] text-[10px] text-muted-foreground">{section.title}</h3>
                    </div>
                    
                    <div className="bg-white/5 border border-white/5 rounded-[40px] overflow-hidden shadow-sm">
                        {section.items.map((item, idx) => (
                            <div key={item.label} className={cn(
                                "flex items-center justify-between p-7 group cursor-pointer transition-all hover:bg-white/5",
                                idx !== section.items.length - 1 && "border-b border-white/5"
                            )}>
                                <div className="flex items-center gap-5 text-white/80 group-hover:text-white transition-colors">
                                    <item.icon size={20} className="group-hover:text-primary transition-colors opacity-40 group-hover:opacity-100" />
                                    <span className="font-bold tracking-wide uppercase text-sm tracking-widest">{item.label}</span>
                                </div>
                                {item.type === "switch" ? (
                                    <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                ) : (
                                    <ChevronRight size={20} className="text-white/10 group-hover:text-primary transition-colors" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        <div className="pt-12 pb-12 text-center">
            <Button variant="ghost" className="text-[10px] uppercase font-black tracking-[0.5em] text-destructive hover:bg-destructive/10">
                Log Out System
            </Button>
        </div>
      </div>
    </div>
  );
}
