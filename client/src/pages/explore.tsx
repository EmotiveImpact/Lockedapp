import { motion } from "framer-motion";
import { BookOpen, PlayCircle, Clock, ChevronRight, Bookmark, Flame, Zap, Brain, Moon, Timer, ShieldAlert, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const ARTICLES = [
  {
    title: "Mastering the 5 AM Protocol",
    category: "Routine",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop",
    isCourse: false,
    content: "Waking up at 5 AM isn't about being productive for the sake of it. It's about winning the first battle of the day. The silence of the morning provides a psychological advantage that sets the tone for everything that follows..."
  },
  {
    title: "The Science of Cold Exposure",
    category: "Health",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1518107616985-bd48230d3b20?q=80&w=400&auto=format&fit=crop",
    isCourse: true,
    content: "Hormetic stress is the key to resilience. By exposing your body to extreme cold, you trigger a massive release of norepinephrine, boosting focus and metabolic rate for hours..."
  },
  {
    title: "Dopamine Detox Guide",
    category: "Mindset",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=400&auto=format&fit=crop",
    isCourse: false,
    content: "Modern society is designed to hijack your reward system. A dopamine detox isn't about removing pleasure, but recalibrating your baseline so that hard things become easy again..."
  },
  {
    title: "Hyper-Focus Framework",
    category: "Performance",
    readTime: "15 min",
    image: "https://images.unsplash.com/photo-1454165833767-1330084b1211?q=80&w=400&auto=format&fit=crop",
    isCourse: true,
    content: "Deep work is the superpower of the 21st century. Learn how to enter a flow state on command and sustain high-output cognitive work without burnout..."
  }
];

export default function ExplorePage() {
  return (
    <div className="flex flex-col min-h-full pb-32">
      <header className="p-8 pt-12 border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-40 flex flex-col items-center">
        <h1 className="text-5xl font-display font-black tracking-tighter italic leading-none uppercase">EXPLORE</h1>
        <p className="text-muted-foreground text-[10px] uppercase tracking-[0.4em] font-black mt-4">UPGRADE YOUR KNOWLEDGE</p>
      </header>

      <div className="p-6 space-y-10">
        {/* Featured Course */}
        <div className="relative rounded-[40px] overflow-hidden aspect-[16/10] group cursor-pointer shadow-2xl border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=600&auto=format&fit=crop" 
              alt="Biohacking"
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.3] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            <div className="absolute top-8 left-8 flex gap-2">
              <span className="bg-primary text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(204,255,0,0.5)]">FEATURED</span>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 italic">Masterclass</p>
              <h3 className="text-3xl font-display font-black leading-none mb-4 uppercase italic">BIOLOGICAL<br/>OPTIMIZATION</h3>
              <Button className="bg-white text-black font-black uppercase tracking-widest text-[10px] h-10 rounded-xl px-6 hover:bg-primary transition-colors">
                  BEGIN TRANSMISSION
              </Button>
            </div>
        </div >

        {/* Intelligence Categories */}
        <div className="grid grid-cols-2 gap-4">
            {[
                { label: 'Neuro', icon: Brain, color: 'text-primary', desc: 'Brain Performance' },
                { label: 'Bio', icon: Activity, color: 'text-primary', desc: 'Body Systems' },
                { label: 'Ritual', icon: Timer, color: 'text-primary', desc: 'Daily Protocols' },
                { label: 'Defense', icon: ShieldAlert, color: 'text-primary', desc: 'Hormetic Stress' },
            ].map(cat => (
                <div key={cat.label} className="bg-white/5 border border-white/5 rounded-[32px] p-6 flex flex-col gap-3 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                        <cat.icon size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest block">{cat.label}</span>
                        <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest opacity-50">{cat.desc}</span>
                    </div>
                </div>
            ))}
        </div>

        {/* Library Section */}
        <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">The Archive</h2>
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">42 Files Found</span>
            </div>

            <div className="space-y-4">
                {ARTICLES.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-6 p-6 bg-white/5 border border-white/5 rounded-[40px] hover:border-white/10 transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <div className="h-20 w-20 flex-shrink-0 rounded-[24px] overflow-hidden shadow-lg border border-white/10">
                            <img src={item.image} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-primary px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                                    {item.category}
                                </span>
                                {item.isCourse && <span className="text-[8px] font-black uppercase tracking-widest text-white/40 border border-white/10 px-2 py-0.5 rounded-full">Course</span>}
                            </div>
                            <h4 className="font-display font-black text-lg leading-tight uppercase italic tracking-tight">{item.title}</h4>
                            <div className="flex items-center gap-4 text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-2 opacity-40">
                                <div className="flex items-center gap-1">
                                    <Clock size={10} />
                                    <span>{item.readTime}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <ChevronRight size={20} className="text-white/10 group-hover:text-primary transition-colors" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
