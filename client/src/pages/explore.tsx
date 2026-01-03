import { motion } from "framer-motion";
import { BookOpen, PlayCircle, Clock, ChevronRight, Bookmark, Flame, Zap, Brain } from "lucide-react";
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
    <div className="flex flex-col min-h-full pb-20">
      <header className="p-6 pt-12 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <h1 className="text-4xl font-display font-bold tracking-tighter italic underline decoration-primary decoration-4 underline-offset-8">EXPLORE</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] font-medium mt-1">Upgrade your knowledge</p>
      </header>

      <div className="p-6 space-y-10">
        {/* Featured Course */}
        <div className="relative rounded-[32px] overflow-hidden aspect-[16/10] group cursor-pointer shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=600&auto=format&fit=crop" 
              alt="Biohacking"
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-primary text-black text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest">Featured</span>
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest">Masterclass</span>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-2xl font-display font-black leading-none mb-2 uppercase">Biological Optimization</h3>
              <p className="text-white/60 text-xs mb-4">A 12-module journey into elite performance.</p>
              <Button className="bg-white text-black font-black uppercase tracking-widest text-[10px] h-8 rounded-full px-4">
                  Start Learning
              </Button>
            </div>
        </div >

        {/* Quick Picks */}
        <div className="grid grid-cols-3 gap-3">
            {[
                { label: 'Routine', icon: Clock, color: 'text-primary' },
                { label: 'Health', icon: Zap, color: 'text-orange-500' },
                { label: 'Mindset', icon: Brain, color: 'text-blue-500' },
            ].map(cat => (
                <div key={cat.label} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer">
                    <cat.icon className={cat.color} size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                </div>
            ))}
        </div>

        {/* Library Section */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold tracking-widest uppercase">The Library</h2>
                <Button variant="link" className="text-primary text-xs uppercase font-bold tracking-widest p-0">See All</Button>
            </div>

            <div className="space-y-4">
                {ARTICLES.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-3xl hover:border-white/10 transition-all cursor-pointer group"
                    >
                        <div className="h-24 w-24 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg">
                            <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[8px] font-black uppercase tracking-widest text-primary px-1.5 py-0.5 bg-primary/10 rounded-sm">
                                    {item.category}
                                </span>
                                {item.isCourse && <span className="text-[8px] font-black uppercase tracking-widest text-white/40 border border-white/10 px-1.5 py-0.5 rounded-sm">Course</span>}
                            </div>
                            <h4 className="font-bold text-base leading-tight mb-2">{item.title}</h4>
                            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock size={10} />
                                    <span>{item.readTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Bookmark size={10} />
                                    <span>Save</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <ChevronRight size={18} className="text-white/20 group-hover:text-primary transition-colors" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
