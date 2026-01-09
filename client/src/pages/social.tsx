import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { useHabits } from "@/hooks/use-habits";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/api";
import { Trophy } from "lucide-react";

export default function SocialPage() {
  const { user: currentUser } = useHabits();
  
  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => getLeaderboard(50),
  });

  return (
    <div className="flex flex-col min-h-full pb-32">
      {/* Header */}
      <header className="p-8 pb-0 border-b border-white/5 bg-gradient-to-b from-black/80 via-black/40 to-black/0 backdrop-blur-md sticky top-0 z-20 flex flex-col items-center relative">
        <div className="w-full flex items-center justify-center absolute top-8 px-6 left-0">
          <h1 className="text-5xl font-display font-black tracking-tighter italic leading-none uppercase whitespace-nowrap">THE CIRCLE</h1>
        </div>

        <div className="mt-16 mb-4 flex flex-col items-center w-full px-4">
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.4em] font-black">GLOBAL RANKINGS</p>
        </div>
      </header>

      <div className="p-6 space-y-3">
        {isLoading ? (
          // Loading skeleton
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/5 animate-pulse">
              <div className="w-8 h-6 bg-white/10 rounded" />
              <div className="h-12 w-12 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-white/10 rounded" />
                <div className="h-1.5 w-full bg-white/10 rounded" />
              </div>
            </div>
          ))
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No competitors yet</p>
            <p className="text-sm text-white/30 mt-2">Be the first to dominate</p>
          </div>
        ) : (
          leaderboard.map((entry, index) => {
            const isCurrentUser = entry.id === currentUser?.id;
            
            return (
              <div 
                key={entry.id}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300",
                  isCurrentUser 
                    ? "bg-primary/5 border-primary/20 shadow-[0_0_25px_rgba(204,255,0,0.1)]" 
                    : "bg-white/5 border-white/5 hover:border-white/10"
                )}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-8 text-center">
                  <span className="font-display font-bold text-lg text-muted-foreground">#{entry.rank}</span>
                </div>
                
                {/* Avatar */}
                <UserAvatar 
                  src={entry.profilePhoto}
                  name={entry.name}
                  id={entry.id}
                  className={cn("h-12 w-12 border-2", isCurrentUser ? "border-primary/30" : "border-white/10")}
                />

                {/* Name & Level */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className={cn("font-bold truncate", isCurrentUser ? "text-primary" : "text-foreground")}>
                      {isCurrentUser ? "You" : entry.name}
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground flex-shrink-0">Lvl {entry.level}</span>
                  </div>
                  
                  {/* XP Progress bar */}
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all", isCurrentUser ? "bg-primary" : "bg-white/30")}
                      style={{ width: `${Math.min((entry.xp % 500) / 5, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold">{entry.xp.toLocaleString()}</div>
                  <div className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">
                    {entry.streak}D STREAK
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
