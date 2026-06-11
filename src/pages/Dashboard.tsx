import PageLayout from "@/layout/PageLayout";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <PageLayout>
      <h1 className={styles.heading}>Dashboard</h1>

      <div className={styles.section}>
        {/* dashboard content */}
      </div>
    </PageLayout>
  );
}
