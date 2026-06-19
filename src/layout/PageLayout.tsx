import { ReactNode } from "react";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function PageLayout({ title, actions, children }: PageLayoutProps) {
  return (
    <div className={styles.container}>
      {(title || actions) && (
        <div className={styles.header}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}

      <div className={styles.content}>{children}</div>
    </div>
  );
}
