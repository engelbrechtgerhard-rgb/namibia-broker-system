import { NavLink } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const { user } = useAuth();

  const rawGroups = user?.profile?.["cognito:groups"];
  const groups = Array.isArray(rawGroups) ? (rawGroups as string[]) : [];
  const isAdmin = groups.includes("Admin");

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.appName}>Broker System</span>
      </div>

      <nav className={styles.nav}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <LayoutDashboard className={styles.icon} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/clients"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <Users className={styles.icon} />
          <span>Clients</span>
        </NavLink>

        <NavLink
          to="/policies"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <ShieldCheck className={styles.icon} />
          <span>Policies</span>
        </NavLink>

        <NavLink
          to="/claims"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <FileText className={styles.icon} />
          <span>Claims</span>
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <BarChart3 className={styles.icon} />
          <span>Reports</span>
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin" className={styles.link}>
            Admin
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
