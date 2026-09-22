import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import AdminLayout from "@/layout/AdminLayout";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { listClientTypes, createClientType, deleteClientType } from "@/api/clientTypes";

export default function ClientTypes() {
  const { user } = useAuth();
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newType, setNewType] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("INDIVIDUAL");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const tenantId = user?.profile?.["custom:tenantId"] as string;

  useEffect(() => {
    if (!user?.id_token) return;
    listClientTypes(user.id_token, tenantId)
      .then(setTypes)
      .finally(() => setLoading(false));
  }, [user?.id_token]);

  async function handleCreate() {
    if (!newType.trim()) return;

    await createClientType(user?.id_token, {
      tenantId,
      name: newType.trim(),
      category: newCategory,
      description: newDescription.trim(),
    });

    setNewType("");
    setNewDescription("");

    const updated = await listClientTypes(user?.id_token, tenantId);
    setTypes(updated);
  }

  async function handleDelete(id: string) {
    await deleteClientType(user?.id_token, id);
    const updated = await listClientTypes(user?.id_token, tenantId);
    setTypes(updated);
    setDeleteId(null);
  }

  return (
    <AdminLayout>
      <h2>Client Types</h2>

      <div>
        <input
          placeholder="New client type…"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        />

        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{ marginLeft: "8px" }}
        >
          <option value="INDIVIDUAL">Individual</option>
          <option value="COMPANY">Company</option>
        </select>

        <input
          placeholder="Description (optional)…"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ marginLeft: "8px", width: "250px" }}
        />

        <Button variant="primary" onClick={handleCreate}>
          Add
        </Button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {types.map((t) => (
            <li key={t.id}>
              <strong>{t.name}</strong> ({t.category})
              {t.description && <div style={{ fontSize: "0.85em", opacity: 0.7 }}>{t.description}</div>}
              {" · "}
              <span style={{ cursor: "pointer", color: "red" }} onClick={() => setDeleteId(t.id)}>
                Delete
              </span>
            </li>
          ))}
        </ul>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete Client Type"
          message="Are you sure you want to delete this type?"
          confirmLabel="Delete"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </AdminLayout>
  );
}