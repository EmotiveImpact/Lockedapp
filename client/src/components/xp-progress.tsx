import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface XPProgressProps {
  current: number;
  total: number;
  level: number;
}

export function XPProgress({ current, total, level }: XPProgressProps) {
  const percentage = Math.min(100, (current / total) * 100);
  const dots = 12; // Number of dots in the circular/linear representation

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-full max-w-[300px] flex flex-col items-center gap-4">
        
        {/* Level Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-display font-bold tracking-[0.2em] mb-2">LOCKED IN</h1>
          <p className="text-muted-foreground text-sm font-medium tracking-wide">
            YOU ARE AT <span className="text-primary font-bold">LVL {level}</span>
          </p>
        </motion.div>

        {/* Progress Bar / Dots */}
        <div className="w-full flex justify-between gap-1 mt-4 px-4">
            {Array.from({ length: 20 }).map((_, i) => {
                const isActive = (i / 20) * 100 < percentage;
                return (
                    <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className={cn(
                            "h-2 w-2 rounded-full transition-colors duration-500",
                            isActive ? "bg-primary shadow-[0_0_8px_var(--color-primary)]" : "bg-white/10"
                        )}
                    />
                )
            })}
        </div>
        
        <div className="flex justify-between w-full px-4 text-xs text-muted-foreground font-mono mt-1">
            <span>{current} XP</span>
            <span>{total} XP</span>
        </div>

      </div>
    </div>
  );
}
