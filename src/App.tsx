import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { setOidcTokens } from "./main";
import ProtectedRoute from "./ProtectedRoute";
import LogoutCleanup from "@/LogoutCleanup";
import AppLayout from "@/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/clients/Clients";
import ClientProfile from "@/pages/clients/ClientProfile";
import AddClient from "@/pages/clients/AddClient";
import Policies from "@/pages/policies/Policies";
import Claims from "@/pages/claims/Claims";
import Reports from "@/pages/reports/Reports";

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.access_token && user?.id_token) {
      setOidcTokens(user.access_token, user.id_token);
    }
  }, [user?.access_token, user?.id_token]);
  return (
    <AppLayout>
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

        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients/:clientId"
          element={
            <ProtectedRoute>
              <ClientProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients/add"
          element={
            <ProtectedRoute>
              <AddClient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/policies"
          element={
            <ProtectedRoute>
              <Policies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/claims"
          element={
            <ProtectedRoute>
              <Claims />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppLayout>
  );
}
