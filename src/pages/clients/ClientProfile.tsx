import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { getClientById } from "@/api/clients";
import PageLayout from "@/layout/PageLayout";
import styles from "Clients.module.css";

export default function ClientProfile() {
  const { user } = useAuth();
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <PageLayout title={`${client.firstName} ${client.lastName}`}>
      <Link to="/clients">← Back to Clients</Link>

      <div className={styles.profileCard}>
        <h3 className={styles.sectionTitle}>Client Information</h3>

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
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Policies</h3>
        <p>Policies integration coming soon…</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Claims</h3>
        <p>Claims integration coming soon…</p>
      </div>
    </PageLayout>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
      <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{label}</p>
      <p style={{ margin: 0, fontWeight: 500 }}>{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8, marginBottom: 16 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </div>
  );
}
