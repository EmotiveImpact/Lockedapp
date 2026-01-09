import { Switch, Route, useLocation, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import HomePage from "@/pages/home";
import HabitsPage from "@/pages/habits";
import SocialPage from "@/pages/social";
import ProfilePage from "@/pages/profile";
import ExplorePage from "@/pages/explore";
import AuthPage from "@/pages/auth-page";
import Layout from "@/components/layout";
import { HabitsProvider, useHabits } from "@/hooks/use-habits";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return <>{children}</>;
}

function Router() {
  const { user } = useAuth();
  const [location] = useLocation();

  // If on auth page and already logged in, redirect to home
  if (location === "/auth" && user) {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/">
        <ProtectedRoute>
          <Layout>
            <HomePage />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/tasks">
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/habits">
        <ProtectedRoute>
          <Layout>
            <HabitsPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/social">
        <ProtectedRoute>
          <Layout>
            <SocialPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/explore">
        <ProtectedRoute>
          <Layout>
            <ExplorePage />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <Layout>
            <ProfilePage />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route>
        <Layout>
          <NotFound />
        </Layout>
      </Route>
    </Switch>
  );
}

function AppContent() {
  const { isLoading: habitsLoading } = useHabits();
  const { isLoading: authLoading } = useAuth();

  if (habitsLoading || authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="text-center space-y-8 relative z-10">
          {/* Animated Logo */}
          <div className="relative flex items-center justify-center">
            <div className="absolute h-32 w-32 rounded-full border-4 border-white/5 border-t-primary animate-spin" />
            <div className="absolute h-24 w-24 rounded-full border-4 border-white/5 border-b-primary animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_60px_rgba(204,255,0,0.6)] animate-pulse">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-black">
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h2 className="text-5xl font-display font-black tracking-tighter uppercase italic text-white">
              LOCKED IN
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              <div className="h-1 w-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="h-1 w-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-primary/70">
              Initializing System
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <Router />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HabitsProvider>
          <AppContent />
          <Toaster />
        </HabitsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
