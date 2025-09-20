import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import ExpensesInsights from "./pages/ExpensesInsights";
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
      <AuthProvider>
        <BrowserRouter basename={baseURL}>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            
            <Route
              element={
                <PrivateRoute>
                  <div className="flex flex-col min-h-screen bg-background">
                    <Header />
                    <main className="flex-1 pb-4">
                      <div className="max-w-[894px] mx-auto px-4">
                        <Outlet />
                      </div>
                    </main>
                    <BottomNavigation />
                  </div>
                </PrivateRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<ExpensesInsights />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/savings/:id" element={<SavingsGoalDetails />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default App;