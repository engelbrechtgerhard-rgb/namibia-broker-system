import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@/layout/PageLayout";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { getClientById, updateClient } from "@/api/clients";
import { useAuth } from "react-oidc-context";
import styles from "./Clients.module.css";

export default function EditClient() {
  const { clientId } = useParams<{ clientId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
  });

  useEffect(() => {
    if (!clientId || !user?.id_token) return;

    getClientById(user.id_token, clientId)
      .then((client) => {
        if (!client) return;

        setForm({
          firstName: client.firstName ?? "",
          lastName: client.lastName ?? "",
          email: client.email ?? "",
          phone: client.phone ?? "",
          idNumber: client.idNumber ?? "",
        });
      })
      .finally(() => setLoading(false));
  }, [clientId, user?.id_token]);

  function updateField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !user?.id_token) return;

    await updateClient(user.id_token, clientId, form);
    navigate(`/clients/${clientId}`);
  }

  if (loading) {
    return <PageLayout title="Edit Client">Loading…</PageLayout>;
  }

  return (
    <PageLayout title="Edit Client">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Card title="Edit Client Details">
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>First Name</label>
              <input
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Last Name</label>
              <input
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input
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
          Save Changes
        </Button>
      </form>
    </PageLayout>
  );
}
