import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const LEADERBOARD = [
  { id: 1, name: "David G.", xp: 12450, level: 24, avatar: "DG", isUser: false },
  { id: 2, name: "Sarah K.", xp: 11200, level: 22, avatar: "SK", isUser: false },
  { id: 3, name: "You", xp: 4200, level: 8, avatar: "ME", isUser: true },
  { id: 4, name: "Mike R.", xp: 3800, level: 7, avatar: "MR", isUser: false },
  { id: 5, name: "Jenny L.", xp: 3150, level: 6, avatar: "JL", isUser: false },
];

export default function SocialPage() {
  return (
    <div className="p-6 pt-12 min-h-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-display font-bold uppercase tracking-wider mb-2">The Circle</h1>
        <p className="text-muted-foreground text-sm">Competitors in your orbit</p>
      </div>

      <div className="space-y-4">
        {LEADERBOARD.map((user, index) => (
          <div 
            key={user.id}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300",
              user.isUser 
                ? "bg-white/5 border-primary/30 shadow-[0_0_15px_rgba(204,255,0,0.1)] scale-[1.02]" 
                : "bg-card border-white/5 hover:border-white/10"
            )}
          >
            <div className="flex-shrink-0 w-8 text-center font-display font-bold text-lg text-muted-foreground">
              #{index + 1}
            </div>
            
            <Avatar className={cn("h-12 w-12 border-2", user.isUser ? "border-primary" : "border-white/10")}>
              <AvatarImage src={`https://avatar.vercel.sh/${user.name}`} />
              <AvatarFallback className="bg-white/10 text-white">{user.avatar}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={cn("font-medium", user.isUser ? "text-primary" : "text-foreground")}>
                  {user.name}
                </h3>
                <span className="text-xs font-mono text-muted-foreground">Lvl {user.level}</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                    className="h-full bg-white/40 rounded-full" 
                    style={{ width: `${(user.xp % 1000) / 10}%` }}
                />
              </div>
            </div>

            <div className="text-right">
                <div className="text-sm font-bold">{user.xp.toLocaleString()}</div>
                <div className="text-[10px] uppercase text-muted-foreground">XP</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
