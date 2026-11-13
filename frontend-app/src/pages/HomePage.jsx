
import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import AppLayout from "./components/layout/AppLayout.jsx";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AssignmentsPage from "./pages/AssignmentsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="app-loading">
      Preparing your workspace…
    </div>;
  }

  return (
    <Routes>

      {/* Public Homepage */}
      <Route
        path="/"
        element={<HomePage />}
      />

      {/* Authentication */}
      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <LoginPage />
        }
      />

      <Route
        path="/register"
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <LoginPage mode="register" />
        }
      />

      {/* Protected Dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/assignments"
            element={<AssignmentsPage />}
          />

          <Route
            path="/notifications"
            element={<NotificationsPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />

        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}
