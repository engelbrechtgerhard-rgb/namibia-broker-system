import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { createClient } from "@/api/clients";
import { listClientTypes } from "@/api/clientTypes";
import PageLayout from "@/layout/PageLayout";
import Button from "@/components/Button";
import Card from "@/components/Card";
import styles from "./Clients.module.css";

export default function AddClient() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientTypes, setClientTypes] = useState<any[]>([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    type: "",
    email: "",
    phone: "",
    idNumber: "",
  });

  useEffect(() => {
    if (!user?.id_token) return;

    const tenantId = user.profile["custom:tenantId"] as string;

    listClientTypes(user.id_token, tenantId).then(setClientTypes);
  }, [user?.id_token]);

  function updateField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id_token) return;

    const profile = user.profile as Record<string, unknown>;
    const tenantId =
      typeof profile["custom:tenantId"] === "string"
        ? profile["custom:tenantId"]
        : "";

    if (!tenantId) return;

    const newClient = await createClient(user.id_token, tenantId, form);
    navigate(`/clients/${newClient.id}`);
  }

  return (
    <PageLayout title="Add Client">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Card title="Client Details">
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>First Name</label>
              <input
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Last Name</label>
              <input
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Type</label>
              <select
                value={form.type ?? ""}
                onChange={(e) => updateField("type", e.target.value)}
                required
              >
                <option value="">Select type…</option>
                {clientTypes.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Phone</label>
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>ID Number</label>
              <input
                value={form.idNumber}
                onChange={(e) => updateField("idNumber", e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Button type="submit" variant="primary" className={styles.saveButton}>
          Save Client
        </Button>
      </form>
    </PageLayout>
  );
}
