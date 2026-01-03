import { motion } from "framer-motion";
import { Settings, Bell, BarChart2, CheckSquare, Flame, User, MessageSquare, Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useHabits } from "@/hooks/use-habits";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { setQuickActionOpen } = useHabits();
  
  const categories = [
    { name: "Today's Tasks", icon: CheckSquare, active: true, action: () => setQuickActionOpen(true) },
    { name: "Stats", icon: BarChart2, active: false, href: "/profile" },
    { name: "Habits", icon: Flame, active: false, href: "/habits" },
    { name: "Me", icon: User, active: false, href: "/profile" },
  ];

  return (
    <div className="flex flex-col min-h-full p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tighter">LOCKED IN</h1>
          <div className="mt-2">
            <h2 className="text-2xl font-bold">Hey, The</h2>
            <p className="text-muted-foreground text-sm">Saturday, March 1</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/profile">
            <Button size="icon" variant="ghost" className="rounded-full bg-white/5 h-10 w-10">
                <Settings size={20} className="text-primary" />
            </Button>
          </Link>
          <Button size="icon" variant="ghost" className="rounded-full bg-white/5 h-10 w-10">
            <Bell size={20} className="text-primary" />
          </Button>
        </div>
      </header>

      {/* Horizontal Categories */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8">
        {categories.map((cat) => (
          cat.href ? (
            <Link key={cat.name} href={cat.href}>
                <Button
                    variant={cat.active ? "default" : "secondary"}
                    className={cn(
                        "flex-shrink-0 h-14 px-6 rounded-2xl flex items-center gap-3 font-bold border-none",
                        cat.active ? "bg-primary text-black" : "bg-white/5 text-white"
                    )}
                >
                    <cat.icon size={20} />
                    {cat.name}
                </Button>
            </Link>
          ) : (
            <Button
                key={cat.name}
                onClick={cat.action}
                variant={cat.active ? "default" : "secondary"}
                className={cn(
                    "flex-shrink-0 h-14 px-6 rounded-2xl flex items-center gap-3 font-bold border-none",
                    cat.active ? "bg-primary text-black" : "bg-white/5 text-white"
                )}
            >
                <cat.icon size={20} />
                {cat.name}
            </Button>
          )
        ))}
      </div>

      {/* Hero Challenge Card */}
      <div className="relative rounded-[32px] overflow-hidden aspect-[4/5] mb-8 group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop" 
            alt="Workout"
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          <div className="absolute top-6 left-6">
            <span className="bg-primary text-black text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest">New</span>
          </div>

          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-2">New Challenge</p>
            <h3 className="text-4xl font-display font-black leading-none mb-3">30-DAY FITNESS CHALLENGE</h3>
            <p className="text-white/60 text-sm mb-6 font-medium">Starts March 1st · Join the community</p>
            
            <div className="flex items-center gap-3">
                <Button className="bg-primary text-black font-black uppercase tracking-widest rounded-lg px-8 py-6 h-auto">
                    Challenge
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full bg-white/10 backdrop-blur-md h-12 w-12 text-white">
                    <Heart size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full bg-white/10 backdrop-blur-md h-12 w-12 text-white">
                    <MoreHorizontal size={20} />
                </Button>
            </div>
          </div>
      </div>

      {/* Motivation Quote Card */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] p-10 relative overflow-hidden group">
          <div className="absolute top-8 left-8 text-primary">
              <MessageSquare fill="currentColor" size={32} />
          </div>
          
          <div className="mt-8 mb-10">
              <p className="text-2xl font-bold leading-tight mb-4">Progress is progress, no matter how small.</p>
              <p className="text-primary font-bold">- Unknown</p>
          </div>

          <Button className="bg-primary text-black font-black uppercase tracking-widest rounded-lg px-6">
              Motivation
          </Button>
      </div>

    </div>
  );
}
