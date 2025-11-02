import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CursorTrail } from "@/components/CursorTrail";
import { ParallaxShapes } from "@/components/ParallaxShapes";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ThemeToggle } from "@/components/ThemeToggle";
import { KonamiCode } from "@/components/KonamiCode";
import { PromoBar } from "@/components/PromoBar";
import TecnoAiLanding from "@/pages/TecnoAiLanding";
import Landing from "@/pages/Landing";
import Builder from "@/pages/Builder";
import ChatBuilder from "@/pages/ChatBuilder";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TecnoAiLanding} />
      <Route path="/landing-old" component={Landing} />
      <Route path="/builder" component={Builder} />
      <Route path="/chat-builder" component={ChatBuilder} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CursorTrail />
        <ParallaxShapes />
        <ScrollProgress />
        <KonamiCode />
        
        <div className="fixed top-4 right-4 z-[60]">
          <ThemeToggle />
        </div>

        <Toaster />
        
        <div className="min-h-screen">
          <PromoBar />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
