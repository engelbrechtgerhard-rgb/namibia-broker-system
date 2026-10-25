import styles from "./TypeBadge.module.css";

export default function TypeBadge({ type }: { type: string }) {
  if (type === "COMPANY") {
    return (
      <span className={`${styles.badge} ${styles.company}`}>
        <span className={styles.icon}>🏢</span>
        Company
      </span>
    );
  }

  return (
    <span className={`${styles.badge} ${styles.individual}`}>
      <span className={styles.icon}>👤</span>
      Individual
    </span>
  );
}
