import { useParams, Link } from 'react-router-dom';
import { useClaims } from '../../hooks/useClaims';
import type { Claim } from '../../types';

interface Props { tenantId: string }

export default function ClaimDetail({ tenantId }: Props) {
  const { claimId } = useParams<{ claimId: string }>();
  const { claims, loading, updateClaimStatus } = useClaims(tenantId);
  const claim = claims.find((c) => c.claimId === claimId);

  if (loading) return <div>Loading…</div>;
  if (!claim) return <div>Claim not found. <Link to="/claims">Back</Link></div>;

  const statuses: Claim['status'][] = ['FNOL', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED'];

  return (
    <div>
      <Link to="/claims">← Back to Claims</Link>
      <h1 style={{ marginTop: 8 }}>Claim {claimId?.slice(0, 8)}…</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[
          ['Status', claim.status], ['Policy ID', claim.policyId.slice(0, 8)],
          ['Incident Date', claim.incidentDate ?? '—'], ['Logged', new Date(claim.createdAt).toLocaleDateString()],
        ].map(([label, value]) => (
          <div key={label} style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{label}</p>
            <p style={{ margin: 0, fontWeight: 500 }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Description</h3>
        <p>{claim.description}</p>
      </div>

      <div style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Update Status</h3>
        <select defaultValue={claim.status} onChange={(e) => updateClaimStatus(claimId!, e.target.value as Claim['status'])}>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {claim.events && claim.events.length > 0 && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Event History</h3>
          {claim.events.map((ev) => (
            <div key={ev.eventId} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ fontWeight: 600 }}>{ev.type}</span>
              <span style={{ marginLeft: 12, color: '#666' }}>{ev.message}</span>
              <span style={{ float: 'right', fontSize: 12, color: '#aaa' }}>{new Date(ev.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
