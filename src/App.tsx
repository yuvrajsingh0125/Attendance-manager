// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Added Navigate
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import Attendance from "./pages/student/Attendance";
import NotFound from "./pages/NotFound";

// --- NEW AUTH IMPORTS ---
import { AuthProvider, ProtectedRoute, useAuth } from './hooks/use-auth';
// ------------------------

const queryClient = new QueryClient();

// Component to handle public routes and redirect if already logged in
const PublicRouteWrapper: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { user, loading } = useAuth();

  // If loading is finished and user exists, redirect them away from public pages
  if (!loading && user) {
    // Assuming default redirection to student dashboard
    return <Navigate to="/dashboard/student" replace />;
  }

  return <>{element}</>;
};

const RootRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* Public Routes: Wrapped to redirect if authenticated */}
      <Route path="/" element={<PublicRouteWrapper element={<Landing />} />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes: Wrapped to enforce authentication */}
      <Route path="/dashboard/student" element={<ProtectedRoute element={<StudentDashboard />} />} />
      <Route path="/dashboard/student/attendance" element={<ProtectedRoute element={<Attendance />} />} />

      {/* Placeholder Protected Routes for other roles */}
      <Route path="/dashboard/teacher" element={<ProtectedRoute element={<StudentDashboard />} />} />
      <Route path="/dashboard/admin" element={<ProtectedRoute element={<StudentDashboard />} />} />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* Wrap the entire app in AuthProvider */}
    <AuthProvider> 
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RootRouter />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;