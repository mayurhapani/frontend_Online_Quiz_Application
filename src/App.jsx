import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthContext } from "./context/AuthProvider.jsx";
import Header from "./components/Header.jsx";
import GlobalLoader from "./components/GlobalLoader.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx"; // Updated
import Profile from "./pages/Profile.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import QuizPage from "./pages/QuizPage.jsx"; // New
import QuizListPage from "./pages/QuizListPage.jsx"; // New
import ResultPage from "./pages/ResultPage.jsx"; // New
import CreateQuiz from "./pages/CreateQuiz.jsx"; // New
import EditQuiz from "./pages/EditQuiz.jsx"; // New

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, loading, user } = useContext(AuthContext);

  if (loading) return <GlobalLoader />;
  if (!isLoggedIn) return <Navigate to="/signin" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

function App() {
  const { loading, user } = useContext(AuthContext);

  const getDashboardByRole = () => {
    switch (user?.role) {
      case "admin":
        return <AdminDashboard />;
      case "user":
        return <UserDashboard />; // Updated
      default:
        return <Navigate to="/signin" />;
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {loading ? (
            <GlobalLoader />
          ) : (
            <Routes>
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<ProtectedRoute>{getDashboardByRole()}</ProtectedRoute>} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quizzes"
                element={
                  <ProtectedRoute>
                    <QuizListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:id"
                element={
                  <ProtectedRoute>
                    <QuizPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/result/:id"
                element={
                  <ProtectedRoute>
                    <ResultPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-quiz"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <CreateQuiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-quiz/:id"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <EditQuiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </main>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
