// src/App.tsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import LogoutCleanup from "@/LogoutCleanup";
import AppLayout from "@/layout/AppLayout";
import OidcCallback from "@/pages/auth/OidcCallback";
import Clients from "@/pages/clients/Clients";
import ClientProfile from "@/pages/clients/ClientProfile";
import AddClient from "@/pages/clients/AddClient";
import Policies from "@/pages/policies/Policies";
import Claims from "@/pages/claims/Claims";
import Reports from "@/pages/reports/Reports";

export default function App() {
  return (
    <Routes>
      {/* Callback must be completely isolated */}
      <Route path="/callback" element={<OidcCallback />} />
      <Route path="/callback/" element={<OidcCallback />} />

      {/* Logout cleanup also must be isolated */}
      <Route path="/clear" element={<LogoutCleanup />} />

      {/* Everything else goes inside the layout */}
      <Route
        path="/*"
        element={
          <AppLayout>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* ... all other protected routes ... */}
            </Routes>
          </AppLayout>
        }
      />
    </Routes>
  );
}
