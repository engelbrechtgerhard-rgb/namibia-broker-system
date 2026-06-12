import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import LogoutCleanup from "@/LogoutCleanup";
import AppLayout from "@/layout/AppLayout";
import Clients from "@/pages/clients/Clients";
import ClientProfile from "@/pages/clients/ClientProfile";
import AddClient from "@/pages/clients/AddClient";
import Policies from "@/pages/policies/Policies";
import Claims from "@/pages/claims/Claims";
import Reports from "@/pages/reports/Reports";

export default function App() {
  return (
    <Routes>
      {/* Logout cleanup must be isolated */}
      <Route path="/clear" element={<LogoutCleanup />} />

      {/* Root route must NOT be nested */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* All other protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Clients />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients/:clientId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ClientProfile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients/add"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AddClient />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/policies"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Policies />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/claims"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Claims />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Reports />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
