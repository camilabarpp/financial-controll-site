import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Insights from "./pages/Insights";
import Savings from "./pages/Savings";
import NotFound from "./pages/NotFound";
import BottomNavigation from "./components/BottomNavigation";
import { Transactions } from "./pages/Transactions";
import SavingsGoalDetails from "./pages/SavingsGoalDetails";
import Account from "./pages/Account";

const queryClient = new QueryClient();
const baseURL = import.meta.env.VITE_BASE_URL;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="*"
            element={
              <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-1 pb-4">
                  <div className="max-w-[894px] mx-auto px-4">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/insights" element={<Insights />} />
                      <Route path="/savings" element={<Savings />} />
                      <Route path="/savings/:id" element={<SavingsGoalDetails />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/account" element={<Account />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </main>
                <BottomNavigation />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
