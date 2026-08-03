import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AppSidebar from "./components/Layout/AppSidebar.jsx";
import RouteGuard from "./components/RouteGuard";
import Login from "./pages/Login";
import HomeDashboard from "./pages/HomeDashboard";
import PracticeRoom from "./pages/PracticeRoom";
import ExamRoom from "./pages/ExamRoom";
import Register from "./pages/Register";
import ResultSummary from "./pages/ResultSummary";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCheatingLogs from "./pages/AdminCheatingLogs";
import AdminUsers from "./pages/AdminUsers";
import Settings from "./pages/Settings";
import LeaderboardPage from "./pages/LeaderboardPage";
import UserProfile from "./pages/UserProfile";
import AdminRoute from "./components/AdminRoute";

function LoginReturnHome({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return children;
}

function ForceAuth({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}

function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <a href="/">Return</a>
    </div>
  );
}

export default function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className={`app-shell ${isAuthenticated ? 'layout-sidebar' : ''}`}>
      <AppSidebar />

      <main className="app-content">
        <Routes>
          <Route
            path="/login"
            element={
              <LoginReturnHome>
                <Login />
              </LoginReturnHome>
            }
          />
          <Route
            path="/register"
            element={
              <LoginReturnHome>
                <Register />
              </LoginReturnHome>
            }
          />
          <Route
            path="/"
            element={
              <ForceAuth>
                <HomeDashboard />
              </ForceAuth>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ForceAuth>
                <LeaderboardPage />
              </ForceAuth>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ForceAuth>
                <UserProfile />
              </ForceAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <ForceAuth>
                <Settings />
              </ForceAuth>
            }
          />

          <Route
            path="/practice/:examId/:skill"
            element={
              <ForceAuth>
                <PracticeRoom />
              </ForceAuth>
            }
          />
          <Route path="/result" element={<ForceAuth><ResultSummary /></ForceAuth>} />
          <Route
            path="/exam/:examId/:skill"
            element={
              <ForceAuth>
                <RouteGuard>
                  <ExamRoom />
                </RouteGuard>
              </ForceAuth>
            }
          />

          <Route
            path="/admin/grading"
            element={
              <ForceAuth>
                <AdminRoute allowedRoles={['admin', 'teacher']}>
                  <AdminDashboard />
                </AdminRoute>
              </ForceAuth>
            }
          />
          <Route
            path="/admin/cheating-logs"
            element={
              <ForceAuth>
                <AdminRoute allowedRoles={['admin', 'teacher']}>
                  <AdminCheatingLogs />
                </AdminRoute>
              </ForceAuth>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ForceAuth>
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              </ForceAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}