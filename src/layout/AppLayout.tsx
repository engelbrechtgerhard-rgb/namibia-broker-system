import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import NavBar from "@/components/NavBar";
import styles from "./AppLayout.module.css";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      <NavBar />

      <div className={styles.body}>
        <Sidebar />

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
