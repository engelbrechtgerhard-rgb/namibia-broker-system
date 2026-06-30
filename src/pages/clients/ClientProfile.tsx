import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import PageLayout from "@/layout/PageLayout";
import { getClientById } from "@/api/clients";

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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 24,
          marginBottom: 24,
        }}
      >
        <InfoCard label="Email" value={client.email ?? "—"} />
        <InfoCard label="Phone" value={client.phone ?? "—"} />
        <InfoCard label="ID Number" value={client.idNumber ?? "—"} />
        <InfoCard
          label="Created"
          value={new Date(client.createdAt).toLocaleDateString()}
        />
      </div>

      <Section title="Policies">
        <p>Policies integration coming soon…</p>
      </Section>

      <Section title="Claims">
        <p>Claims integration coming soon…</p>
      </Section>
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
