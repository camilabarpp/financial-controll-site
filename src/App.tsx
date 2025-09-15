import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useContext, useState, useEffect } from "react";
// Auth Context
export const AuthContext = createContext({
  isAuthenticated: false,
  login: (token: string) => {},
  logout: () => {},
});

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected Route
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
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
      <AuthProvider>
        <BrowserRouter basename={baseURL}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="*"
              element={
                <PrivateRoute>
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
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
