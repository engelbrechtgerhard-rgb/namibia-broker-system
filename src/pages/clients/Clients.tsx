import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { listClients, deleteClient } from "@/api/clients";
import { logAudit } from "@/api/audit";
import PageLayout from "@/layout/PageLayout";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import ActionsCell from "@/components/ActionsCell";
import styles from "./Clients.module.css";
import TypeBadge from "@/components/TypeBadge";

export default function Clients() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const groups = (user?.profile?.["cognito:groups"] as string[]) ?? [];
  const isAdmin = groups.includes("Admin");

  useEffect(() => {
    if (!user?.id_token) return;
    listClients(user.id_token)
      .then(setClients)
      .finally(() => setLoading(false));
  }, [user?.id_token]);

  // Dynamic name resolution
  function getDisplayName(c: any) {
    if (c.type === "COMPANY") {
      return c.companyName || "—";
    }
    return `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || "—";
  }

  // Improved search: supports companyName + individual names
  const filtered = clients.filter((c) => {
    const name = getDisplayName(c).toLowerCase();
    return name.includes(search.toLowerCase());
  });

  async function handleDelete(id: string) {
    if (!user?.id_token) return;

    const tenantId = user.profile?.["custom:tenantId"] as string;

    await deleteClient(user.id_token, id);

    await logAudit(user.id_token, {
      tenantId,
      entityType: "Client",
      entityId: id,
      action: "DELETE",
      performedBy: user.profile.email ?? user.profile.sub ?? "unknown",
      performedByName: `${user.profile.given_name ?? ""} ${user.profile.family_name ?? ""}`.trim(),
      timestamp: new Date().toISOString(),
      details: "Client deleted from Clients list",
    });

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
              <th>Type</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{getDisplayName(c)}</td>
                <td>
                  <TypeBadge type={c.type} />
                </td>
                <td>{c.email ?? "—"}</td>
                <td>{c.phone ?? "—"}</td>
                <td>
                  <ActionsCell
                    id={c.id}
                    isAdmin={isAdmin}
                    onView={() => navigate(`/clients/${c.id}`)}
                    onEdit={() => navigate(`/clients/${c.id}/edit`)}
                    onDelete={() => setDeleteId(c.id)}
                  />
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
