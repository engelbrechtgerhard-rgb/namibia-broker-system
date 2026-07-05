import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { getClientById, deleteClient } from "@/api/clients";
import PageLayout from "@/layout/PageLayout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import styles from "./Clients.module.css";

export default function ClientProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!clientId || !user?.id_token) return;
    getClientById(user.id_token, clientId)
      .then(setClient)
      .finally(() => setLoading(false));
  }, [clientId, user?.id_token]);

  if (loading) return <PageLayout title="Client Profile">Loading…</PageLayout>;

  if (!client)
    return (
      <PageLayout title="Client Profile">
        Client not found. <Link to="/clients">Back</Link>
      </PageLayout>
    );

  async function handleDelete() {
    if (!user?.id_token || !clientId) return;

    await deleteClient(user.id_token, clientId);

    navigate("/clients");
  }

  return (
    <PageLayout title={`${client.firstName} ${client.lastName}`}>
      <Link to="/clients">← Back to Clients</Link>

      <div className="mt-md">
        <Button variant="secondary" onClick={() => navigate(`/clients/${client.id}/edit`)}>
          Edit Client
        </Button>

        <Button
          variant="secondary"
          onClick={() => setShowDelete(true)}
          style={{ marginLeft: "var(--space-sm)" }}
        >
          Delete Client
        </Button>
      </div>

      <Card title="Client Information">
        <div className={styles.profileGrid}>
          <div className={styles.profileField}>
            <span className={styles.label}>Email</span>
            <span>{client.email || "—"}</span>
          </div>

          <div className={styles.profileField}>
            <span className={styles.label}>Phone</span>
            <span>{client.phone || "—"}</span>
          </div>

          <div className={styles.profileField}>
            <span className={styles.label}>ID Number</span>
            <span>{client.idNumber || "—"}</span>
          </div>

          <div className={styles.profileField}>
            <span className={styles.label}>Created</span>
            <span>{new Date(client.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>

      <Card title="Policies">
        <p>Policies integration coming soon…</p>
      </Card>

      <Card title="Claims">
        <p>Claims integration coming soon…</p>
      </Card>

      {showDelete && (
        <ConfirmModal
          title="Delete Client"
          message="Are you sure you want to delete this client?"
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </PageLayout>
  );
}
