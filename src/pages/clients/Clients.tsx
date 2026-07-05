import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import PageLayout from "@/layout/PageLayout";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { listClients, deleteClient } from "@/api/clients";
import styles from "./Clients.module.css";

export default function Clients() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id_token) return;
    listClients(user.id_token)
      .then(setClients)
      .finally(() => setLoading(false));
  }, [user?.id_token]);

  const filtered = clients.filter((c) => {
    const fullName = `${c.firstName ?? ""} ${c.lastName ?? ""}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  async function handleDelete(id: string) {
    if (!user?.id_token) return;

    await deleteClient(user.id_token, id);

    // Remove from list
    setClients((prev) => prev.filter((c) => c.id !== id));

    setDeleteId(null);
  }

  return (
    <PageLayout
      title="Clients"
      actions={
        <Button variant="primary" onClick={() => navigate("/clients/add")}>
          + Add Client
        </Button>
      }
    >
      <div className={styles.searchRow}>
        <input
          placeholder="Search clients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.firstName} {c.lastName}</td>
                <td>{c.email ?? "—"}</td>
                <td>{c.phone ?? "—"}</td>
                <td>
                  <Link to={`/clients/${c.id}`} className={styles.viewLink}>
                    View
                  </Link>
                  {" · "}
                  <Link to={`/clients/${c.id}/edit`} className={styles.viewLink}>
                    Edit
                  </Link>
                  {" · "}
                  <span
                    className={styles.viewLink}
                    style={{ cursor: "pointer" }}
                    onClick={() => setDeleteId(c.id)}
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete Client"
          message="Are you sure you want to delete this client? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </PageLayout>
  );
}
