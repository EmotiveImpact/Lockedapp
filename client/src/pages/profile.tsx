import { useHabits } from "@/hooks/use-habits";
import { Circle, Zap, Flame, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user } = useHabits();

  const stats = [
    { label: "Current Streak", value: user.streak, icon: Flame, color: "text-orange-500" },
    { label: "Total XP", value: user.currentXp.toLocaleString(), icon: Zap, color: "text-primary" },
    { label: "Completion Rate", value: "84%", icon: Circle, color: "text-blue-500" },
    { label: "Days Active", value: "12", icon: Calendar, color: "text-purple-500" },
  ];

  return (
    <div className="p-6 pt-12 min-h-full">
      <div className="flex flex-col items-center mb-10">
        <div className="h-24 w-24 rounded-full border-4 border-primary/20 bg-card flex items-center justify-center mb-4 relative">
            <span className="text-3xl font-display font-bold">{user.name.charAt(0)}</span>
            <div className="absolute bottom-0 right-0 bg-primary text-black text-xs font-bold px-2 py-1 rounded-full border-2 border-background">
                Lvl {user.level}
            </div>
        </div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">Member since 2024</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2">
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
            <div className="text-2xl font-display font-bold">{stat.value}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-card border border-white/5 rounded-xl p-6">
        <h3 className="font-display font-bold uppercase tracking-wider mb-4">Badges</h3>
        <div className="flex gap-4 flex-wrap">
            {['Early Bird', 'Consistency', 'Machine'].map(badge => (
                <div key={badge} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/80">
                    {badge}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
