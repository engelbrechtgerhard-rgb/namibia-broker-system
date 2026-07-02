import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { createClient } from "@/api/clients";
import PageLayout from "@/layout/PageLayout";
import Button from "@/components/Button";
import styles from "./Clients.module.css";

export default function AddClient() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
  });

  function updateField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id_token) return;
    const profile = user.profile as Record<string, unknown>;
    const tenantId = typeof profile["custom:tenantId"] === "string" ? profile["custom:tenantId"] : "";
    if (!tenantId) return;
    const newClient = await createClient(user.id_token, tenantId, form);
    navigate(`/clients/${newClient.id}`);
  }

  return (
    <PageLayout title="Add Client">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>Client Details</h3>

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
        </div>

        <Button type="submit" variant="primary" className={styles.saveButton}>
          Save Client
        </Button>
      </form>
    </PageLayout>
  );
}
