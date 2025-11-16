
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

interface ProtectedRouteProps {
  requiredProfileTypes?: string[];
  redirectTo?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredProfileTypes,
  redirectTo = "/login",
  children,
}) => {
  const { user, loading, hasPermission } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log("ProtectedRoute mounted, path:", location.pathname);
    console.log("Auth state:", loading ? "loading" : user ? "authenticated" : "unauthenticated");
    return () => console.log("ProtectedRoute unmounted, path:", location.pathname);
  }, [location.pathname, loading, user]);
  
  console.log("ProtectedRoute rendering, loading:", loading, "user:", !!user, "path:", location.pathname);

  if (loading) {
    console.log("Showing loading spinner in ProtectedRoute");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-lg text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("User not authenticated, redirecting to:", redirectTo);
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  if (requiredProfileTypes?.length && !hasPermission(requiredProfileTypes)) {
    console.log("User doesn't have required permissions, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("User authenticated and has permissions, rendering protected content");
  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-red-700 mb-4">Error in Protected Route</h2>
          <p className="text-red-600 mb-4">Something went wrong loading this page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    }>
      {children || <Outlet />}
    </ErrorBoundary>
  );
};

export default ProtectedRoute;
