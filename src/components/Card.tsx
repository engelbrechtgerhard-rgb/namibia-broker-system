import { ReactNode } from "react";
import styles from "./Card.module.css";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Card({ title, children, className }: CardProps) {
  return (
    <div className={`${styles.card} ${className ?? ""}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {children}
    </div>
  );
}
