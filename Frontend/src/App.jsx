import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; // 1. Import the Toaster for notifications
import { AuthProvider } from "./context/AuthContext"; // 2. Import your AuthProvider

// Your Page and Component Imports
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TaskDetails from "./pages/TaskDetails";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      {/* 3. Wrap your entire application in the AuthProvider */}
      {/* This makes user data available to all components, including the Navbar and Protected Routes */}
      <AuthProvider>

        {/* 4. Add the Toaster component here */}
        {/* It needs to be included once at the top level to render notifications anywhere in your app */}
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            {/* Your original routes remain unchanged */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            <Route path="/task/:id" element={<ProtectedRoute><TaskDetails /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute adminOnly={true}><Users /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
            {/* <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            /> */}

          </Routes>
        </div>

      </AuthProvider>
    </BrowserRouter>
  );
}
