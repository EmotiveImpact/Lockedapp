import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DayStatus } from "@/hooks/use-habits";

interface SprintProgressProps {
  days: DayStatus[];
  level: number;
}

export function XPProgress({ days, level }: SprintProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[320px] flex flex-col items-center">
        {/* 28 Day Sprint Grid (14x2 for compact look) */}
        <div className="w-full grid grid-cols-14 gap-1.5 px-2">
            {days.map((status, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.01 }}
                    className={cn(
                        "h-2.5 w-2.5 rounded-full transition-all duration-500",
                        status === 'completed' && "bg-primary shadow-[0_0_8px_var(--color-primary)]",
                        status === 'failed' && "bg-destructive shadow-[0_0_8px_var(--color-destructive)]",
                        status === 'pending' && "bg-white/10"
                    )}
                />
            ))}
        </div>
      </div>
    </div>
  );
}
