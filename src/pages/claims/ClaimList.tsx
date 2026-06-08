import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClaims } from '../../hooks/useClaims';
import { usePolicies } from '../../hooks/usePolicies';
import type { Claim } from '../../types';

interface Props { tenantId: string }

export default function ClaimList({ tenantId }: Props) {
  const { claims, loading, logClaim } = useClaims(tenantId);
  const { policies } = usePolicies(tenantId);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ policyId: '', clientId: '', description: '', incidentDate: '' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const policy = policies.find((p) => p.policyId === form.policyId);
    await logClaim({ ...form, clientId: policy?.clientId ?? form.clientId });
    setShowForm(false);
  };

  const statusColor: Record<Claim['status'], string> = {
    FNOL: '#3b82f6', UNDER_REVIEW: '#f59e0b', APPROVED: '#22c55e', REJECTED: '#ef4444', CLOSED: '#6b7280',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Claims</h1>
        <button onClick={() => setShowForm(true)}>+ Log Claim (FNOL)</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16 }}>
          <h3 style={{ marginTop: 0 }}>Log FNOL</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <select required value={form.policyId} onChange={(e) => setForm({ ...form, policyId: e.target.value })}>
              <option value="">Select Policy</option>
              {policies.map((p) => <option key={p.policyId} value={p.policyId}>{p.policyNumber ?? p.policyId.slice(0, 8)} — {p.insurer}</option>)}
            </select>
            <input type="date" placeholder="Incident Date" value={form.incidentDate} onChange={(e) => setForm({ ...form, incidentDate: e.target.value })} />
            <textarea required placeholder="Description of incident…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ gridColumn: '1 / -1', height: 80 }} />
          </div>
          <div style={{ marginTop: 12 }}>
            <button type="submit">Submit FNOL</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <div>Loading…</div> : (
        <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse', borderRadius: 8 }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={th}>Claim ID</th><th style={th}>Policy</th><th style={th}>Status</th><th style={th}>Incident Date</th><th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.claimId}>
                <td style={td}>{c.claimId.slice(0, 8)}…</td>
                <td style={td}>{c.policyId.slice(0, 8)}…</td>
                <td style={td}><span style={{ color: statusColor[c.status], fontWeight: 600 }}>{c.status}</span></td>
                <td style={td}>{c.incidentDate ?? '—'}</td>
                <td style={td}><Link to={`/claims/${c.claimId}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: '10px 12px', textAlign: 'left', fontWeight: 600 };
const td: React.CSSProperties = { padding: '10px 12px', borderTop: '1px solid #eee' };
