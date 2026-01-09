import { Search, Bell, MessageSquare, Plus } from "lucide-react";
import { useHabits } from "@/hooks/use-habits";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function DesktopHeader() {
  const { user } = useHabits();

  return (
    <header className="h-24 sticky top-0 z-40 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md border-b border-white/5">
      {/* Search Bar */}
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Search protocols, habits, or members..."
          className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-display tracking-wide"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 mr-4">
          <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all relative">
            <Bell size={18} className="text-muted-foreground" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
          </button>
          <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
            <MessageSquare size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
          <Link href="/profile">
            <div className="flex items-center gap-3 cursor-pointer group">
              <UserAvatar 
                src={user.profilePhoto}
                name={user.name}
                id={user.id}
                className="h-10 w-10 border-2 border-primary/20 group-hover:border-primary/50 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              />
              <div className="hidden xl:block">
                <p className="text-sm font-black tracking-tight uppercase group-hover:text-primary transition-colors">{user.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Level {user.level}</p>
              </div>
            </div>
          </Link>

          <Link href="/tasks">
            <Button className="bg-primary text-black hover:bg-primary/90 rounded-xl px-6 font-display font-black uppercase tracking-widest text-xs h-10 shadow-[0_0_20px_rgba(204,255,0,0.3)]">
              <Plus className="mr-2 h-4 w-4 stroke-[3px]" />
              Create
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
