import styles from "./ActionsCell.module.css";

type ActionsCellProps = {
  id: string;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin: boolean;
};

export default function ActionsCell({
  id,
  onView,
  onEdit,
  onDelete,
  isAdmin,
}: ActionsCellProps) {
  return (
    <div className={styles.actions}>
      <span className={styles.link} onClick={onView}>
        View
      </span>

      {onEdit && (
        <>
          {" · "}
          <span className={styles.link} onClick={onEdit}>
            Edit
          </span>
        </>
      )}

      {isAdmin && onDelete && (
        <>
          {" · "}
          <span className={styles.link} onClick={onDelete}>
            Delete
          </span>
        </>
      )}
    </div>
  );
}