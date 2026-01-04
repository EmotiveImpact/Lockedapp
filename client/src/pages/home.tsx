import { motion } from "framer-motion";
import { Settings, Bell, BarChart2, CheckSquare, Flame, User, MessageSquare, Heart, MoreHorizontal, Zap, Users, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useHabits } from "@/hooks/use-habits";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { user, setQuickActionOpen } = useHabits();
  
  return (
    <div className="flex flex-col min-h-full pb-32">
      {/* Unified Header */}
      <header className="p-8 pt-12 border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-40 flex flex-col items-center">
        <h1 className="text-5xl font-display font-black tracking-tighter italic leading-none uppercase">LOCKED IN</h1>
        <p className="text-muted-foreground text-[10px] uppercase tracking-[0.4em] font-black mt-4">SYSTEM STATUS: <span className="text-primary">LVL {user.level} ACTIVE</span></p>
      </header>

      <div className="p-6 space-y-8 mt-4">
        {/* Dice-style Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col items-center justify-center aspect-square shadow-2xl relative overflow-hidden group hover:bg-white/10 transition-all">
            <div className="absolute inset-0 bg-primary/5 blur-[40px] rounded-full translate-y-1/2 group-hover:bg-primary/10" />
            <span className="text-[12px] font-black uppercase tracking-widest text-muted-foreground mb-4 opacity-40 relative z-10">Streak</span>
            <div className="text-6xl font-display font-black text-white relative z-10">{user.streak}D</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col items-center justify-center aspect-square shadow-2xl relative overflow-hidden group hover:bg-white/10 transition-all">
            <div className="absolute inset-0 bg-primary/5 blur-[40px] rounded-full translate-y-1/2 group-hover:bg-primary/10" />
            <span className="text-[12px] font-black uppercase tracking-widest text-muted-foreground mb-4 opacity-40 relative z-10">XP</span>
            <div className="text-6xl font-display font-black text-primary relative z-10 drop-shadow-[0_0_15px_rgba(204,255,0,0.3)]">+{user.todayCompletions.length * 50}</div>
          </div>
        </div>

        {/* Protocol Button - Even sleeker */}
        <button 
          onClick={() => setQuickActionOpen(true)}
          className="w-full bg-white/5 border border-white/10 rounded-[40px] p-12 flex items-center justify-between group hover:border-primary/50 transition-all shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-left relative z-10">
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-3 italic">SYSTEM ACCESS</p>
            <h3 className="text-4xl font-display font-black leading-none uppercase tracking-tighter">PROTOCOL</h3>
          </div>
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-black shadow-[0_0_30px_rgba(204,255,0,0.5)] group-hover:scale-110 transition-transform relative z-10">
            <Zap size={32} fill="currentColor" />
          </div>
        </button>

        {/* Secondary Navigation Grid - Minimalized */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/social" className="w-full">
            <div className="bg-white/5 border border-white/5 rounded-[40px] p-8 flex flex-col items-center gap-4 hover:bg-white/10 transition-all group">
              <Users size={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">CIRCLE</span>
            </div>
          </Link>
          <Link href="/explore" className="w-full">
            <div className="bg-white/5 border border-white/5 rounded-[40px] p-8 flex flex-col items-center gap-4 hover:bg-white/10 transition-all group">
              <Compass size={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">LIBRARY</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
