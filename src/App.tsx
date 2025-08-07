
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmailVerification from "./pages/EmailVerification";
import ApplicationDetails from "./pages/ApplicationDetails";
import PaymentOptions from "./pages/PaymentOptions";
import PaymentProcessing from "./pages/PaymentProcessing";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentHistory from "./pages/PaymentHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EmailVerification />} />
          <Route path="/application-details" element={<ApplicationDetails />} />
          <Route path="/payment-options" element={<PaymentOptions />} />
          <Route path="/payment" element={<PaymentProcessing />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
