import { useHabits } from "@/hooks/use-habits";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from "@/lib/utils";
import { TrendingUp, Users, Wallet, ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { XPProgress } from "@/components/xp-progress";

export default function DesktopDashboard() {
  const { user, habits } = useHabits();

  // Mock data for charts - in a real app this would come from the API
  const performanceData = [
    { name: '14', value: 400 },
    { name: '15', value: 600 },
    { name: '16', value: 350 },
    { name: '17', value: 900, active: true },
    { name: '19', value: 500 },
    { name: '18', value: 800 },
    { name: '20', value: 200 },
  ];

  const categoryData = [
    { name: 'Fitness', value: 66, color: '#CCFF00' },
    { name: 'Mindset', value: 15, color: '#FFFFFF' },
    { name: 'Health', value: 17, color: '#444444' },
  ];

  const members = [
    { name: 'Gladyce', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop' },
    { name: 'Elbert', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop' },
    { name: 'Joyce', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' },
    { name: 'Joyce', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop' },
    { name: 'Joyce', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop' },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Column: Overview & Activity */}
      <div className="col-span-12 xl:col-span-8 space-y-6">
        {/* Overview Header */}
        <div className="bg-[#111111] border border-white/5 rounded-[40px] p-10 relative overflow-hidden">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-display font-black uppercase tracking-tight">Overview</h2>
            <div className="flex items-center gap-2 bg-black/40 border border-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Last 7 Days
              <ChevronRight size={14} className="rotate-90" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users size={18} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Total XP</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl font-display font-black tracking-tighter italic">{user.currentXp.toLocaleString()}</span>
                <div className="flex items-center gap-1 text-[#FF5C5C] bg-[#FF5C5C]/10 px-2 py-1 rounded-lg text-[10px] font-black tracking-widest leading-none">
                  <ArrowDownRight size={12} />
                  36.8%
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-50">vs last month</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wallet size={18} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">XP Balance</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl font-display font-black tracking-tighter italic">{(user.nextLevelXp - user.currentXp).toLocaleString()}</span>
                <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-lg text-[10px] font-black tracking-widest leading-none">
                  <ArrowUpRight size={12} />
                  36.8%
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-50">vs last week</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-black uppercase tracking-widest text-white/40">28-Day Sprint Progress</p>
            <div className="flex justify-center py-4">
              <XPProgress days={user.sprintDays} level={user.level} />
            </div>
          </div>

          <div className="space-y-4 mt-8 pt-8 border-t border-white/5">
            <p className="text-sm font-black uppercase tracking-widest text-white/40">Recently Active Members</p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {members.map((m, i) => (
                  <Avatar key={i} className="h-14 w-14 border-4 border-[#111111] shadow-xl">
                    <AvatarImage src={m.image} />
                    <AvatarFallback>{m.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
                <div className="h-14 w-14 rounded-full bg-white/5 border-4 border-[#111111] flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-white/10 transition-colors">
                  <ChevronRight size={24} />
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">View All</span>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-[#111111] border border-white/5 rounded-[40px] p-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-display font-black uppercase tracking-tight">Performance view</h2>
            <div className="flex items-center gap-2 bg-black/40 border border-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Last 7 Days
              <ChevronRight size={14} className="rotate-90" />
            </div>
          </div>

          <div className="mb-8">
            <span className="text-6xl font-display font-black tracking-tighter italic">$10.2m</span>
            <div className="flex items-center gap-1 text-primary bg-primary/10 w-fit mt-4 px-2 py-1 rounded-lg text-[10px] font-black tracking-widest">
              <ArrowUpRight size={12} />
              36.8% <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </div>

          <div className="h-[300px] w-full mt-12">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <Bar 
                  dataKey="value" 
                  radius={[12, 12, 12, 12]}
                  shape={(props: any) => {
                    const { x, y, width, height, payload } = props;
                    return (
                      <rect 
                        x={x} 
                        y={y} 
                        width={width} 
                        height={height} 
                        fill={payload.active ? '#CCFF00' : '#222222'} 
                        rx={16}
                      />
                    );
                  }}
                />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }}
                  dy={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column: Statistics */}
      <div className="col-span-12 xl:col-span-4 space-y-6">
        {/* Device/Category Stats */}
        <div className="bg-[#111111] border border-white/5 rounded-[40px] p-10 h-fit">
          <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-12">Category focus</h2>
          
          <div className="relative h-64 w-64 mx-auto mb-12">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-display font-black tracking-tighter italic">12.5%</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">Mobile</span>
            </div>
            {/* Pop out detail */}
            <div className="absolute top-0 right-0 bg-[#222] border border-white/10 p-2 rounded-xl text-[8px] font-black text-white flex flex-col items-center shadow-xl">
              <span>Mobile</span>
              <span className="text-primary mt-1">1,485</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{cat.name}</span>
                </div>
                <span className="text-xs font-black text-white pl-4">{cat.value}.20%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Protocols */}
        <div className="bg-[#111111] border border-white/5 rounded-[40px] p-10">
          <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-10">Active protocols</h2>
          
          <div className="space-y-6">
            {[
              { title: "Neurochemistry", category: "Mindset", value: "$3,250.00", status: "Active", image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=100" },
              { title: "Sleep Architecture", category: "Health", value: "$7,890.00", status: "Active", image: "https://images.unsplash.com/photo-1511295742364-917e704b624e?q=80&w=100" },
              { title: "Cold Exposure", category: "Routine", value: "$1,500.00", status: "Offline", image: "https://images.unsplash.com/photo-1471018658974-ad238626c9f8?q=80&w=100" },
              { title: "Full Body Elite", category: "Fitness", value: "$4,750.00", status: "Active", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=100" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 group cursor-pointer">
                <div className="h-16 w-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                  <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-black uppercase tracking-wide truncate pr-4">{item.title}</h4>
                    <span className="text-xs font-black tabular-nums">{item.value}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.category}</span>
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                      item.status === 'Active' ? "bg-primary/10 text-primary" : "bg-white/5 text-muted-foreground"
                    )}>{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full mt-10 bg-transparent border border-white/10 text-muted-foreground font-black uppercase tracking-widest rounded-2xl h-14 text-[10px] hover:bg-white/5 transition-all">
            All protocols
          </Button>
        </div>
      </div>
    </div>
  );
}
