import { useParams, Link } from 'react-router-dom';
import { useClients } from '../../hooks/useClients';
import { usePolicies } from '../../hooks/usePolicies';
import { useClaims } from '../../hooks/useClaims';

interface Props { tenantId: string }

export default function ClientProfile({ tenantId }: Props) {
  const { clientId } = useParams<{ clientId: string }>();
  const { clients, loading } = useClients(tenantId);
  const { policies } = usePolicies(tenantId);
  const { claims } = useClaims(tenantId);

  const client = clients.find((c) => c.clientId === clientId);
  const clientPolicies = policies.filter((p) => p.clientId === clientId);
  const clientClaims = claims.filter((c) => c.clientId === clientId);

  if (loading) return <div>Loading…</div>;
  if (!client) return <div>Client not found. <Link to="/clients">Back</Link></div>;

  return (
    <div>
      <Link to="/clients">← Back to Clients</Link>
      <h1 style={{ marginTop: 8 }}>{client.name}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <InfoCard label="Type" value={client.type} />
        <InfoCard label="Email" value={client.email ?? '—'} />
        <InfoCard label="Phone" value={client.phone ?? '—'} />
        <InfoCard label="ID Number" value={client.idNumber ?? '—'} />
        <InfoCard label="Address" value={client.address ?? '—'} />
        <InfoCard label="Member Since" value={new Date(client.createdAt).toLocaleDateString()} />
      </div>

      <Section title={`Policies (${clientPolicies.length})`}>
        {clientPolicies.map((p) => (
          <div key={p.policyId} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <Link to={`/policies/${p.policyId}`}>{p.policyNumber ?? p.policyId}</Link>
            <span style={{ marginLeft: 12, color: '#666' }}>{p.insurer} — {p.status}</span>
          </div>
        ))}
      </Section>

      <Section title={`Claims (${clientClaims.length})`}>
        {clientClaims.map((c) => (
          <div key={c.claimId} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <Link to={`/claims/${c.claimId}`}>{c.claimId.slice(0, 8)}…</Link>
            <span style={{ marginLeft: 12, color: '#666' }}>{c.status} — {c.description.slice(0, 60)}</span>
          </div>
        ))}
      </Section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
      <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{label}</p>
      <p style={{ margin: 0, fontWeight: 500 }}>{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </div>
  );
}
