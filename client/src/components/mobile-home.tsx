import { motion } from "framer-motion";
import { Settings, Bell, BarChart2, CheckSquare, Flame, User, MessageSquare, Heart, MoreHorizontal, Zap, Users, Compass, Brain, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useHabits } from "@/hooks/use-habits";
import { XPProgress } from "@/components/xp-progress";
import { cn } from "@/lib/utils";

export default function MobileHome() {
  const { user } = useHabits();

  return (
    <div className="flex flex-col min-h-full pb-32">
      {/* Unified Header (aligned with Task screen header positioning) */}
      <header className="p-8 pb-0 border-b border-white/5 bg-gradient-to-b from-black/80 via-black/40 to-black/0 backdrop-blur-md sticky top-0 z-20 flex flex-col items-center relative">
        <div className="w-full flex items-center justify-center absolute top-8 px-6 left-0">
          <h1 className="text-5xl font-display font-black tracking-tighter italic leading-none uppercase whitespace-nowrap">LOCKED IN</h1>
        </div>

        <div className="mt-16 mb-4 flex flex-col items-center w-full px-4">
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.4em] font-black mb-4">SYSTEM STATUS: <span className="text-primary">LVL {user.level} ACTIVE</span></p>
          <div data-testid="home-sprint-dots">
            <XPProgress days={user.sprintDays} level={user.level} />
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8 mt-2 pb-24">
        {/* Welcome Message (raised slightly for better visual balance) */}
        <div className="px-2 -mt-2">
          <h2 className="text-3xl font-display font-black tracking-tight uppercase italic">Welcome back, Soldier</h2>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic opacity-70">Ready to execute protocol?</p>
        </div>

        {/* Hero Challenge Card - MOVED TO TOP */}
        <div className="relative rounded-[40px] overflow-hidden aspect-[4/5] group cursor-pointer shadow-2xl border border-white/10">
            <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop" 
                alt="Workout"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.3] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            <div className="absolute top-8 left-8">
                <span className="bg-primary text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(204,255,0,0.5)]">LIVE CHALLENGE</span>
            </div>

            <div className="absolute bottom-10 left-10 right-10">
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 italic">Active Event</p>
                <h3 className="text-5xl font-display font-black leading-tight mb-4 uppercase italic tracking-tighter">30-DAY<br/>MONK MODE</h3>
                <p className="text-white/40 text-xs mb-8 font-black uppercase tracking-widest">Starts in 48 hours · 1.2k Joining</p>
                
                <Button className="w-full bg-white text-black font-black uppercase tracking-widest rounded-2xl h-16 text-sm hover:bg-primary transition-colors">
                    Join Protocol
                </Button>
            </div>
        </div>

        {/* Dice-style Stats Grid - MOVED BELOW HERO */}
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
        <Link 
          href="/tasks"
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
        </Link>

        {/* Motivation Quote Card - Restored & Elevated */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 relative overflow-hidden group shadow-xl">
            <div className="absolute -top-4 -left-4 text-primary/10 rotate-12">
                <MessageSquare fill="currentColor" size={120} />
            </div>
            
            <div className="relative z-10 text-center">
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-6 italic opacity-50">Daily Transmission</p>
                <p className="text-3xl font-display font-black leading-tight mb-6 uppercase italic tracking-tight">"DISCIPLINE IS THE BRIDGE BETWEEN GOALS AND ACCOMPLISHMENT."</p>
                <div className="h-px w-12 bg-primary/30 mx-auto mb-6" />
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">— JIM ROHN</p>
            </div>
        </div>

        {/* Learning/Resources Section - NEW Addition */}
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Intelligence</h2>
                <Link href="/explore">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Access Library →</span>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                {[
                    { title: "Neurochemistry of Focus", tag: "Mindset", icon: Brain },
                    { title: "Sleep Architecture", tag: "Health", icon: Moon },
                ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-[32px] p-6 flex items-center gap-6 hover:bg-white/10 transition-all cursor-pointer group">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                            <item.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-primary/50 mb-1">{item.tag}</p>
                            <h4 className="font-bold text-sm uppercase tracking-wide">{item.title}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
