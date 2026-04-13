import { Outlet, useLocation } from "react-router-dom";
import { PublicNavbar } from "../components/layout/PublicNavbar";
import { PageTransition } from "../components/common/PageTransition";

export function PublicLayout() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      <div className="grid-noise" />
      <PublicNavbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <PageTransition pageKey={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
