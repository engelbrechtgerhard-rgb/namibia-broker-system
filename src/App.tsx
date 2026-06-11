// src/App.tsx
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
