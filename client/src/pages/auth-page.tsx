import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaApple } from "react-icons/fa";


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const { loginMutation, registerMutation } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate({ username, password });
    } else {
      registerMutation.mutate({ username, password, email });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden animate-fade-in">
      {/* Animated background effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="w-full max-w-md px-8 relative z-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display font-black tracking-tighter uppercase italic text-white">
            LOCKED IN
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-primary/70 mt-3">
            {isLogin ? "Welcome Back" : "Create Account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs uppercase tracking-wider text-white/60">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-14 bg-white/5 border-white/10 text-white text-base placeholder:text-white/30 focus:border-primary focus:ring-primary"
                placeholder="Enter username"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-white/60">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 bg-white/5 border-white/10 text-white text-base placeholder:text-white/30 focus:border-primary focus:ring-primary"
                  placeholder="Enter email"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider text-white/60">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 bg-white/5 border-white/10 text-white text-base placeholder:text-white/30 focus:border-primary focus:ring-primary"
                placeholder="Enter password"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-white text-black hover:bg-primary hover:text-black font-display uppercase tracking-wider text-xl py-8 transition-all duration-300"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                {isLogin ? "Signing In..." : "Creating Account..."}
              </div>
            ) : (
              isLogin ? "Lock In" : "Create Account"
            )}
          </Button>
        </form>

        {/* Toggle */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-white/50 hover:text-primary transition-colors"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-primary font-semibold">
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </button>
        </div>

        {/* OAuth Buttons */}
        <div className="mt-8 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-4 text-white/40 tracking-wider">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 py-6 text-base"
            >
              <FaGoogle className="h-9 w-9 mr-3" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 py-6 text-base"
            >
              <FaApple className="h-9 w-9 mr-3" />
              Apple
            </Button>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="mt-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
            Focus • Pray • Lock In
          </p>
        </div>
      </div>
    </div>
  );
}
