import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthContext } from "./context/AuthProvider.jsx";
import Header from "./components/Header.jsx";
import GlobalLoader from "./components/GlobalLoader.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CourseManagement from "./pages/CourseManagement.jsx";
import EnrollmentManagement from "./pages/EnrollmentManagement.jsx";
import GradeManagement from "./pages/GradeManagement.jsx";
import Profile from "./pages/Profile.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";

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
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
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
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    {getDashboardByRole()}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/course-management"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                    <CourseManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/enrollment-management"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <EnrollmentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/grade-management"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                    <GradeManagement />
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
