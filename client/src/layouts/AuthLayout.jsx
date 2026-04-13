import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { useAuthStore } from "../store/authStore";
import { Skeleton } from "../components/ui/Skeleton";

export function AuthLayout() {
  const location = useLocation();
  const didBootstrap = useRef(false);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    if (didBootstrap.current) return;
    didBootstrap.current = true;
    bootstrap();
  }, [bootstrap]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <Skeleton className="mb-4 h-14 w-full" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <AppShell />;
}
