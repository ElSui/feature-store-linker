
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import UseCases from "./pages/UseCases";
import RiskIndicators from "./pages/RiskIndicators";
import Features from "./pages/Features";
import Relationships from "./pages/Relationships";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/documents/*" element={<Documents />} />
          <Route path="/use-cases/*" element={<UseCases />} />
          <Route path="/risk-indicators/*" element={<RiskIndicators />} />
          <Route path="/features/*" element={<Features />} />
          <Route path="/relationships" element={<Relationships />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
