import { useHabits } from "@/hooks/use-habits";
import { Settings, ChevronRight, Bell, Moon, Volume2, Shield, Mail, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="flex flex-col min-h-full p-6 pt-12">
      <h1 className="text-3xl font-display font-bold text-center mb-8 tracking-widest">LOCKED IN</h1>

      {/* Profile Header */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex items-center gap-6 mb-8">
        <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-white/10">
                <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" />
                <AvatarFallback>LU</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-background">
                Lvl {user.level}
            </div>
        </div>
        <div>
            <h2 className="text-xl font-bold">LOCKED IN User</h2>
            <p className="text-muted-foreground text-sm">Discipline is freedom</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 grid grid-cols-3 divide-x divide-white/10 mb-8">
          <div className="text-center px-2">
              <div className="text-primary text-2xl font-display font-black leading-none mb-1">480</div>
              <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">Total XP</div>
          </div>
          <div className="text-center px-2">
              <div className="text-primary text-2xl font-display font-black leading-none mb-1">0</div>
              <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">Sprints</div>
          </div>
          <div className="text-center px-2">
              <div className="text-primary text-2xl font-display font-black leading-none mb-1">{user.streak}</div>
              <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">Days</div>
          </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
          {sections.map((section) => (
              <div key={section.title} className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                      <section.icon size={18} />
                      <h3 className="font-bold uppercase tracking-widest text-sm">{section.title}</h3>
                  </div>
                  
                  <div className="space-y-1">
                      {section.items.map((item) => (
                          <div key={item.label} className="flex items-center justify-between py-3 group cursor-pointer border-b border-white/5 last:border-0">
                              <div className="flex items-center gap-4 text-white/80 group-hover:text-white transition-colors">
                                  <item.icon size={20} />
                                  <span className="font-medium">{item.label}</span>
                              </div>
                              {item.type === "switch" ? (
                                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                              ) : (
                                  <ChevronRight size={20} className="text-muted-foreground" />
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          ))}
      </div>

      <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-primary mb-2">
              <Shield size={18} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Support</h3>
          </div>
      </div>
    </div>
  );
}
