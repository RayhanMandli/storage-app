import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { HomePage } from "../pages/public/HomePage";
import { PricingPage } from "../pages/public/PricingPage";
import { AboutPage } from "../pages/public/AboutPage";
import { LoginPage } from "../pages/public/LoginPage";
import { SignupPage } from "../pages/public/SignupPage";
import { DashboardPage } from "../pages/app/DashboardPage";
import { DirectoryPage } from "../pages/app/DirectoryPage";
import { UploadPage } from "../pages/app/UploadPage";
import { SharedPage } from "../pages/app/SharedPage";
import { ItemViewPage } from "../pages/app/ItemViewPage";
import { ItemEditPage } from "../pages/app/ItemEditPage";
import { ProfilePage } from "../pages/app/ProfilePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RouteErrorPage } from "../pages/RouteErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "pricing", element: <PricingPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
    ],
  },
  {
    path: "/app",
    element: <AuthLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "directory/:id?", element: <DirectoryPage /> },
      { path: "shared", element: <SharedPage /> },
      { path: "upload", element: <UploadPage /> },
      { path: "item/:type/:id", element: <ItemViewPage /> },
      { path: "item/:type/:id/edit", element: <ItemEditPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
