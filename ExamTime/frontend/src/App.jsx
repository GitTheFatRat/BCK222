import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RouteGuard from "./components/RouteGuard";
import Login from "./pages/Login";
import HomeDashboard from "./pages/HomeDashboard";
import PracticeRoom from "./pages/PracticeRoom";
import ExamRoom from "./pages/ExamRoom";
import Register from "./pages/Register";
import ResultSummary from "./pages/ResultSummary";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCheatingLogs from "./pages/AdminCheatingLogs";
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
  return (
    <div className="app-shell">
      <Navbar />

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
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </ForceAuth>
            }
          />
          <Route
            path="/admin/cheating-logs"
            element={
              <ForceAuth>
                <AdminRoute>
                  <AdminCheatingLogs />
                </AdminRoute>
              </ForceAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}