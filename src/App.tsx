
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Login } from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import Members from "@/pages/admin/Members";
import Chapters from "@/pages/admin/Chapters";
import Deals from "@/pages/admin/Deals";
import Forms from "@/pages/admin/Forms";
import Reports from "@/pages/admin/Reports";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/admin" replace /> : <Login />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/members" element={
        <ProtectedRoute>
          <Members />
        </ProtectedRoute>
      } />
      <Route path="/admin/chapters" element={
        <ProtectedRoute>
          <Chapters />
        </ProtectedRoute>
      } />
      <Route path="/admin/deals" element={
        <ProtectedRoute>
          <Deals />
        </ProtectedRoute>
      } />
      <Route path="/admin/forms" element={
        <ProtectedRoute>
          <Forms />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
