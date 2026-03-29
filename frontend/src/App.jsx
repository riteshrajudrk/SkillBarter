import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ProfileSetupPage from "./pages/ProfileSetupPage.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ToastContainer from "./components/shared/ToastContainer.jsx";
import { useAuthStore } from "./store/authStore.js";

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);

  if (!initialized) {
    return <div className="p-6 text-sm text-slate-500">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const AppRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  if (user && !user.onboardingCompleted) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};

export default function App() {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute>
              <ProfileSetupPage />
            </ProtectedRoute>
          }
        />
        <Route element={<AppShell />}>
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <AppRoute>
                  <FeedPage />
                </AppRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppRoute>
                  <DashboardPage />
                </AppRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <AppRoute>
                  <MessagesPage />
                </AppRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppRoute>
                  <ProfilePage />
                </AppRoute>
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/explore" element={<Navigate to="/feed" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
