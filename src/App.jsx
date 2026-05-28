import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import NavBar from "@/components/NavBar";
import LogoutCleanup from "@/LogoutCleanup";

export default function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/clear" element={<LogoutCleanup />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
