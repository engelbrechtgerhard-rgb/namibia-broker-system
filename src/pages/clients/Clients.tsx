import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import PageLayout from "@/layout/PageLayout";
import Button from "@/components/Button";
import { listClients } from "@/api/clients";
import styles from "./Clients.module.css";

export default function Clients() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
              <th></th>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PageLayout>
  );
}
