import { useHabits } from "@/hooks/use-habits";
import { Settings, ChevronRight, Zap, Target, Flame, Activity, ShieldCheck, HeartPulse, Moon, ArrowRight, Camera } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfilePhoto } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CircularProgressProps {
  value: number;
  max: number;
  label: string;
  sublabelText: string;
  color: string;
  size?: number;
}

function CircularProgress({ value, max, label, sublabelText, color, size = 100 }: CircularProgressProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-white/5"
          />
          {/* Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-display font-black leading-none">{label}</span>
          <span className="text-[8px] font-black opacity-40 uppercase tracking-tighter">
            {percentage}%
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase font-black tracking-widest text-white/60">{sublabelText}</span>
        <ChevronRight className="h-3 w-3 text-white/20 mt-0.5" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, habits } = useHabits();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadPhotoMutation = useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({ title: "PHOTO SYNCED", description: "Identity updated correctly." });
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "FILE TOO LARGE", description: "Max payload size is 2MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      uploadPhotoMutation.mutate(base64);
    };
    reader.readAsDataURL(file);
  };

  // Calculate daily stats for the rings
  const completedHabitsCount = habits?.filter(h => user.todayCompletions.includes(h.id)).length || 0;
  const totalHabitsCount = habits?.length || 1;
  const levelProgress = user.currentXp % user.nextLevelXp;
  
  return (
    <div className="flex flex-col min-h-full pb-32 bg-black text-white font-sans selection:bg-primary selection:text-black">
      {/* Top Navigation - Whoop Style */}
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-black/60 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <UserAvatar 
              src={user.profilePhoto} 
              name={user.name} 
              id={user.id} 
              className="h-10 w-10 border-2 border-primary/20"
            />
            <label 
              htmlFor="profile-upload" 
              className="absolute -bottom-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg active:scale-90 transition-all border-2 border-black"
            >
              <Camera className="h-2.5 w-2.5 text-black" />
            </label>
            <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <Flame className="h-3.5 w-3.5 text-[#FF5F1F]" fill="currentColor" />
            <span className="text-xs font-black tracking-tighter">{user.streak}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <ChevronRight className="h-4 w-4 text-white/20 rotate-180" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">TODAY</span>
          <ChevronRight className="h-4 w-4 text-white/20" />
        </div>

        <button 
          onClick={() => setLocation("/settings")}
          className="p-2.5 rounded-full bg-white/5 border border-white/10 active:scale-95 transition-all text-white/60 hover:text-white"
        >
          <Settings className="h-5 w-5" />
        </button>
      </header>

      <div className="flex flex-col items-center mt-4">
        <h1 className="text-3xl font-display font-black uppercase tracking-widest text-[#E0E0E0] opacity-80 mb-8 italic">CORE SYSTEM</h1>

        {/* The Three Rings - WHOOP Style */}
        <div className="grid grid-cols-3 w-full px-6 gap-2 mb-12">
          <CircularProgress 
            value={completedHabitsCount} 
            max={totalHabitsCount} 
            label={completedHabitsCount.toString()} 
            sublabelText="TODAY" 
            color="#00E676" 
          />
          <CircularProgress 
            value={levelProgress} 
            max={user.nextLevelXp} 
            label={percentageToString(levelProgress, user.nextLevelXp)} 
            sublabelText="LEVEL" 
            color="#2979FF" 
          />
          <CircularProgress 
            value={user.currentXp} 
            max={user.nextLevelXp * 10} 
            label={user.level.toString()} 
            sublabelText="STATUS" 
            color="#D500F9" 
          />
        </div>

        {/* Information Monitors */}
        <div className="grid grid-cols-2 w-full px-6 gap-4 mb-8">
          <div className="bg-[#151515] border border-white/10 rounded-[32px] p-6 space-y-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[9px] font-black uppercase tracking-widest">System Monitor</span>
              <ChevronRight className="h-3 w-3" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#00E676]/10 flex items-center justify-center border border-[#00E676]/20 shadow-[0_0_20px_rgba(0,230,118,0.1)]">
                <ShieldCheck className="h-5 w-5 text-[#00E676]" />
              </div>
              <div>
                <div className="text-[#00E676] text-xs font-black uppercase tracking-tighter">Operational</div>
                <div className="text-[9px] text-white/40 uppercase font-black">{completedHabitsCount}/{totalHabitsCount} Tasks Done</div>
              </div>
            </div>
          </div>

          <div className="bg-[#151515] border border-white/10 rounded-[32px] p-6 space-y-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[9px] font-black uppercase tracking-widest">Power Reserve</span>
              <ChevronRight className="h-3 w-3" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#2979FF]/10 flex items-center justify-center border border-[#2979FF]/20 shadow-[0_0_20px_rgba(41,121,255,0.1)]">
                <Zap className="h-5 w-5 text-[#2979FF]" />
              </div>
              <div>
                <div className="text-[#2979FF] text-xs font-black uppercase tracking-tighter">Aggressive</div>
                <div className="text-[9px] text-white/40 uppercase font-black">{user.currentXp} Total XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* My System - Actionable Banner */}
        <div className="w-full px-6 mb-8">
           <h2 className="text-xl font-display font-black tracking-tight mb-4 ml-2">My System</h2>
           <div className="bg-gradient-to-r from-[#1A1C2E] to-[#121422] border border-white/10 rounded-[32px] p-6 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-all">
                   <Target className="h-6 w-6 text-white/60" />
                </div>
                <div>
                   <div className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                      <span className="text-sm font-bold tracking-tight">System Performance Review</span>
                   </div>
                   <p className="text-[10px] text-white/40 uppercase font-black tracking-wider mt-1 italic">Scan complete. Optimization required.</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-white/20 group-hover:translate-x-1 transition-transform" />
           </div>
        </div>

        {/* Secondary Info Cards */}
        <div className="w-full px-6 space-y-4">
           {/* Sleep/Recovery Style Monitor */}
           <div className="bg-[#151515] border border-white/10 rounded-[40px] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <ChevronRight className="h-5 w-5 text-white/20" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6 px-1">SYSTEM RESTORE</h3>
              
              <div className="flex items-center gap-8">
                <div className="flex-1 space-y-6">
                   <div className="flex items-center gap-4">
                      <Moon className="h-6 w-6 text-primary" />
                      <div>
                        <div className="text-2xl font-black italic">OPTIMAL</div>
                        <div className="text-[8px] uppercase tracking-widest font-black text-primary animate-pulse">Ready for lock-in</div>
                      </div>
                   </div>
                   
                   <div className="h-px w-full bg-white/5" />
                   
                   <button className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]">
                      <Activity className="h-3.5 w-3.5 text-white/40" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Detailed Analytics</span>
                   </button>
                </div>
                
                {/* Visualizer placeholder */}
                <div className="h-32 w-16 bg-gradient-to-t from-primary/5 to-primary/20 rounded-full border border-primary/20 flex flex-col items-center justify-end p-1 gap-1">
                   <div className="w-full h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(204,255,0,0.4)]" />
                   <div className="w-full h-6 bg-primary/40 rounded-full" />
                   <div className="w-full h-12 bg-primary/10 rounded-full" />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function percentageToString(value: number, max: number): string {
  const p = Math.min(Math.round((value / max) * 100), 100);
  return `${p}%`;
}
