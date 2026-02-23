import { BrowserRouter, Routes, Route } from "react-router-dom";

// User Pages
import Login from "./login.jsx";
import MultiStepForm from "./MultiStepForm.jsx";

// Admin Pages
import AdminRegister from "./admin/AdminRegister.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import ManageUsers from "./admin/ManageUsers.jsx";
import ViewData from "./admin/ViewData.jsx";
import ProtectedRoute from "./admin/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* User Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/form" element={<MultiStepForm />} />

        {/* Admin Routes */}
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/data"
          element={
            <ProtectedRoute>
              <ViewData />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;