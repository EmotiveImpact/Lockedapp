import { Switch, Route } from "wouter";
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
import Layout from "@/components/layout";
import { HabitsProvider, useHabits } from "@/hooks/use-habits";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/tasks" component={Dashboard} />
        <Route path="/habits" component={HabitsPage} />
        <Route path="/social" component={SocialPage} />
        <Route path="/explore" component={ExplorePage} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AppContent() {
  const { isLoading } = useHabits();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="h-16 w-16 mx-auto rounded-full border-4 border-white/10 border-t-primary animate-spin" />
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-black tracking-tighter uppercase italic text-primary">LOCKED IN</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground">Initializing System...</p>
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
      <HabitsProvider>
        <AppContent />
        <Toaster />
      </HabitsProvider>
    </QueryClientProvider>
  );
}

export default App;
