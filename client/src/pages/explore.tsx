import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, PlayCircle, Clock, ChevronRight, Brain, Timer, ShieldAlert, Activity, ArrowLeft, Play, Pause, SkipForward, SkipBack, Flame, ChevronDown, Check, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHabits } from "@/hooks/use-habits";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBulkHabits } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// --- Types ---
type ViewState = "list" | "details" | "player";

interface ProtocolHabit {
  title: string;
  xp: number;
  category: "health" | "mindset" | "fitness" | "routine";
}

interface Course {
  id: number;
  title: string;
  category: string;
  readTime: string;
  image: string;
  isCourse: boolean;
  content: string;
  kcal?: string;
  habits: ProtocolHabit[];
}

interface Exercise {
  id: number;
  title: string;
  duration: string;
  image: string;
}

// --- Data ---
const FEATURED = {
  id: 0,
  title: "BIOLOGICAL OPTIMIZATION",
  subtitle: "Masterclass",
  image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=600&auto=format&fit=crop",
  category: "Performance",
  readTime: "45 min",
  isCourse: true,
  content: "Master the art of biological optimization through cutting-edge protocols.",
  kcal: "500 Kcal",
  habits: [
    { title: "Morning Sunlight View", xp: 150, category: "health" },
    { title: "Zone 2 Cardio (45m)", xp: 300, category: "fitness" },
    { title: "No Phone First 30m", xp: 100, category: "mindset" }
  ]
};

const CATEGORIES = [
  { label: 'Neuro', icon: Brain, desc: 'Brain Performance' },
  { label: 'Bio', icon: Activity, desc: 'Body Systems' },
  { label: 'Ritual', icon: Timer, desc: 'Daily Protocols' },
  { label: 'Defense', icon: ShieldAlert, desc: 'Hormetic Stress' },
];

const ARTICLES: Course[] = [
  {
    id: 1,
    title: "Mastering the 5 AM Protocol",
    category: "Routine",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop",
    isCourse: false,
    content: "Waking up at 5 AM isn't about being productive for the sake of it. It's about winning the first battle of the day.",
    habits: [
      { title: "Wake up at 5:00 AM", xp: 200, category: "routine" },
      { title: "Drink 500ml Water", xp: 50, category: "health" }
    ]
  },
  {
    id: 2,
    title: "The Science of Cold Exposure",
    category: "Health",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1518107616985-bd48230d3b20?q=80&w=400&auto=format&fit=crop",
    isCourse: true,
    content: "Hormetic stress is the key to resilience. By exposing your body to extreme cold, you trigger massive norepinephrine release.",
    kcal: "200 Kcal",
    habits: [
      { title: "Cold Shower (2 min)", xp: 250, category: "health" },
      { title: "Box Breathing", xp: 100, category: "mindset" }
    ]
  },
  {
    id: 3,
    title: "Dopamine Detox Guide",
    category: "Mindset",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=400&auto=format&fit=crop",
    isCourse: false,
    content: "Modern society is designed to hijack your reward system. Recalibrate your baseline.",
    habits: [
      { title: "No Social Media", xp: 300, category: "mindset" },
      { title: "Read 10 Pages", xp: 150, category: "mindset" }
    ]
  },
  {
    id: 4,
    title: "Hyper-Focus Framework",
    category: "Performance",
    readTime: "15 min",
    image: "https://images.unsplash.com/photo-1454165833767-1330084b1211?q=80&w=400&auto=format&fit=crop",
    isCourse: true,
    content: "Deep work is the superpower of the 21st century. Enter flow state on command.",
    kcal: "300 Kcal",
    habits: [
      { title: "Deep Work (90 min)", xp: 500, category: "routine" },
      { title: "Binaural Beats", xp: 50, category: "mindset" }
    ]
  }
];

const EXERCISES: Exercise[] = [
  { id: 1, title: "Introduction & Setup", duration: "5:00 min", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=200" },
  { id: 2, title: "Core Concepts", duration: "12:00 min", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200" },
  { id: 3, title: "Practical Application", duration: "15:00 min", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=200" },
  { id: 4, title: "Advanced Techniques", duration: "20:00 min", image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=200" },
];

export default function ExplorePage() {
  const { user } = useHabits();
  const [view, setView] = useState<ViewState>("list");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(27);

  // Mutation for installing protocol
  const installMutation = useMutation({
    mutationFn: (habits: ProtocolHabit[]) => createBulkHabits(habits),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "PROTOCOL INSTALLED",
        description: "System updated. Execute immediately.",
        duration: 3000,
        className: "bg-primary text-black border-none font-black uppercase tracking-widest"
      });
      setView("list");
    },
    onError: (error) => {
      toast({
        title: "INSTALLATION FAILED",
        description: "System error. Try again.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === "player" && isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, isPlaying]);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setView("details");
  };

  const handleFeaturedClick = () => {
    setSelectedCourse(FEATURED as Course);
    setView("details");
  };

  const handleStartWorkout = () => {
    if (selectedCourse?.isCourse) {
      setView("player");
      setIsPlaying(true);
    } else if (selectedCourse) {
      // For articles/routines, "Reading" implies installing the protocol
      installMutation.mutate(selectedCourse.habits);
    }
  };

  const handleInstallProtocol = () => {
    if (selectedCourse) {
      installMutation.mutate(selectedCourse.habits);
    }
  };

  const handleBack = () => {
    if (view === "player") setView("details");
    else if (view === "details") setView("list");
  };

  return (
    <div className="flex flex-col min-h-full pb-32">
      
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: LIST (Explore Home) */}
        {view === "list" && (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col min-h-full"
          >
            {/* Header - Matching Dashboard Structure */}
            <header className="p-8 pb-0 bg-gradient-to-b from-black/80 via-black/40 to-black/0 backdrop-blur-md sticky top-0 z-20 border-b border-white/5 flex flex-col items-center relative">
              <div className="w-full flex items-center justify-center absolute top-8 px-6 left-0">
                <h1 className="text-5xl font-display font-black tracking-tighter italic leading-none uppercase whitespace-nowrap">EXPLORE</h1>
              </div>
              
              <div className="mt-16 mb-4 flex flex-col items-center w-full px-4">
                <p className="text-muted-foreground text-[10px] uppercase tracking-[0.4em] font-black">UPGRADE YOUR KNOWLEDGE</p>
              </div>
            </header>

            <div className="p-6 space-y-10">
              {/* Featured Course */}
              <div 
                onClick={handleFeaturedClick}
                className="relative rounded-[40px] overflow-hidden aspect-[16/10] group cursor-pointer shadow-2xl border border-white/10 hover:scale-[1.01] active:scale-[0.98] transition-transform"
              >
                <img 
                  src={FEATURED.image}
                  alt="Featured"
                  className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.3] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <div className="absolute top-8 left-8 flex gap-2">
                  <span className="bg-primary text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(204,255,0,0.5)]">FEATURED</span>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 italic">{FEATURED.subtitle}</p>
                  <h3 className="text-3xl font-display font-black leading-none mb-4 uppercase italic">{FEATURED.title.split(' ')[0]}<br/>{FEATURED.title.split(' ')[1]}</h3>
                  <Button className="bg-white text-black font-black uppercase tracking-widest text-[10px] h-10 rounded-xl px-6 hover:bg-primary transition-colors">
                    View Protocol
                  </Button>
                </div>
              </div>

              {/* Intelligence Categories */}
              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map(cat => (
                  <div key={cat.label} className="bg-white/5 border border-white/5 rounded-[32px] p-6 flex flex-col gap-3 hover:bg-white/10 active:bg-white/10 active:scale-[0.97] transition-all cursor-pointer group">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black group-active:bg-primary group-active:text-black transition-all">
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
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{ARTICLES.length} Files Found</span>
                </div>

                <div className="space-y-4">
                  {ARTICLES.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleCourseClick(item)}
                      className="flex gap-6 p-6 bg-white/5 border border-white/5 rounded-[40px] hover:border-white/10 active:border-white/10 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.98]"
                    >
                      <div className="h-20 w-20 flex-shrink-0 rounded-[24px] overflow-hidden shadow-lg border border-white/10">
                        <img src={item.image} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-active:grayscale-0 group-active:brightness-100 transition-all duration-500" />
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
                        <ChevronRight size={20} className="text-white/10 group-hover:text-primary group-active:text-primary transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: DETAILS */}
        {view === "details" && selectedCourse && (
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col min-h-screen relative bg-black overflow-y-auto"
          >
            {/* Hero Background */}
            <div className="absolute top-0 left-0 w-full h-[65vh] z-0">
              <img 
                src={selectedCourse.image} 
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
            </div>

            {/* Back Button */}
            <div className="relative z-10 p-6 pt-12">
              <button 
                onClick={handleBack}
                className="h-12 w-12 bg-black/30 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/10 active:scale-95 transition-all"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col flex-1 justify-end px-6 mt-auto">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                    {selectedCourse.category}
                  </span>
                  {selectedCourse.isCourse && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50 border border-white/10 px-3 py-1 rounded-full">Course</span>
                  )}
                </div>

                <h1 className="text-4xl font-display font-black leading-[0.95] mb-6 tracking-tight uppercase italic">
                  {selectedCourse.title}
                </h1>

                <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-md">
                  {selectedCourse.content}
                </p>

                {/* Habits Preview */}
                <div className="mb-8 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Protocol Habits</h3>
                  {selectedCourse.habits.map((habit, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {habit.category === 'health' && <Activity size={14} />}
                        {habit.category === 'fitness' && <Flame size={14} />}
                        {habit.category === 'mindset' && <Brain size={14} />}
                        {habit.category === 'routine' && <Clock size={14} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white">{habit.title}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{habit.xp} XP</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {selectedCourse.isCourse ? (
                    <Button 
                      onClick={handleStartWorkout}
                      className="flex-1 h-16 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-white/90"
                    >
                      <Play className="mr-2 h-5 w-5 fill-black" />
                      Start Course
                    </Button>
                  ) : null}
                  
                  <Button 
                    onClick={handleInstallProtocol}
                    disabled={installMutation.isPending}
                    className="flex-1 h-16 rounded-2xl bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/90 shadow-[0_0_30px_rgba(204,255,0,0.3)]"
                  >
                    {installMutation.isPending ? "Installing..." : "Install Protocol"}
                  </Button>
                </div>

              </motion.div>

              {/* Modules List (Only for courses) */}
              {selectedCourse.isCourse && (
                <div className="bg-[#1C1C1E] rounded-t-[40px] p-8 -mx-6 pb-32 mt-8">
                  <div className="w-full flex justify-center mb-6">
                    <div className="w-12 h-1.5 bg-white/10 rounded-full" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-display font-black text-xl uppercase tracking-tight">Modules</h3>
                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{EXERCISES.length} Parts</span>
                  </div>

                  <div className="space-y-4">
                    {EXERCISES.map((ex, i) => (
                      <div key={ex.id} className="group flex items-center gap-5 p-4 rounded-[24px] hover:bg-white/5 active:bg-white/5 active:scale-[0.98] transition-all cursor-pointer border border-transparent hover:border-white/5 active:border-white/5">
                        <div className="h-16 w-16 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 relative">
                          <img src={ex.image} alt={ex.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-active:grayscale-0 transition-all duration-500" />
                          <div className="absolute top-1.5 left-1.5 h-5 w-5 rounded-full bg-black/70 flex items-center justify-center text-[9px] font-bold border border-white/10">
                            {i + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base leading-tight mb-1">{ex.title}</h4>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{ex.duration}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-primary group-hover:text-primary group-active:border-primary group-active:text-primary transition-colors">
                          <Play className="h-4 w-4 ml-0.5 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity fill-current" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW 3: PLAYER */}
        {view === "player" && (
          <motion.div 
            key="player"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col h-screen fixed inset-0 z-[60] bg-black"
          >
            {/* Background */}
            <div className="absolute inset-0 z-0">
              <img 
                src={selectedCourse?.image || FEATURED.image}
                alt="Current"
                className="w-full h-[70%] object-cover grayscale-[30%] opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
            </div>

            {/* Header */}
            <div className="relative z-10 p-6 flex items-center justify-between pt-12">
              <button 
                onClick={handleBack}
                className="h-12 w-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
              >
                <ChevronDown className="h-6 w-6" />
              </button>
              
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">Live Session</span>
              </div>
            </div>

            {/* Player Controls */}
            <div className="absolute bottom-0 left-0 w-full z-20 pb-12 pt-24 px-6 bg-gradient-to-t from-black via-black/95 to-transparent">
              <div className="mb-6 flex items-center justify-between text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                <span>{progress}% Complete</span>
                <span>Time Remaining</span>
              </div>
              
              {/* Progress */}
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-10">
                <motion.div 
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${progress}%` }}
                />
              </div>

              {/* Timer */}
              <div className="flex flex-col items-center mb-10">
                <h2 className="text-[6rem] font-display font-black tracking-tighter tabular-nums leading-[0.8]">00:35</h2>
                <p className="text-sm font-bold text-white/40 uppercase tracking-[0.4em] mt-2">Active</p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between px-4 mb-8">
                <button className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:bg-white/10 active:scale-95 transition-all">
                  <SkipBack className="h-5 w-5" />
                </button>
                
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-24 w-24 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(204,255,0,0.3)] hover:scale-105 transition-all active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8 text-black fill-black" />
                  ) : (
                    <Play className="h-8 w-8 text-black fill-black ml-1" />
                  )}
                </button>

                <button className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
