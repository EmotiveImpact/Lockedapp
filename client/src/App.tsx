import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import HabitsPage from "@/pages/habits";
import SocialPage from "@/pages/social";
import ProfilePage from "@/pages/profile";
import Layout from "@/components/layout";
import { HabitsProvider } from "@/hooks/use-habits";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/habits" component={HabitsPage} />
        <Route path="/social" component={SocialPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HabitsProvider>
        <Router />
        <Toaster />
      </HabitsProvider>
    </QueryClientProvider>
  );
}

export default App;
