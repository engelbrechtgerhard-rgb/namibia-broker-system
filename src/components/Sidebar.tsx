import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h3>Menu</h3>

      <ul className={styles.menu}>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/clients"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Clients
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/policies"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Policies
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/claims"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Claims
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Reports
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
