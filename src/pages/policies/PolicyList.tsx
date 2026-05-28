import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePolicies } from '../../hooks/usePolicies';
import { useClients } from '../../hooks/useClients';
import type { Policy } from '../../types';

interface Props { tenantId: string }

export default function PolicyList({ tenantId }: Props) {
  const { policies, loading, createPolicy } = usePolicies(tenantId);
  const { clients } = useClients(tenantId);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientId: '', insurer: '', policyNumber: '', premium: '', commission: '', renewalDate: '', type: '' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPolicy({ ...form, premium: Number(form.premium), commission: Number(form.commission), status: 'ACTIVE' });
    setShowForm(false);
  };

  const statusColor: Record<Policy['status'], string> = {
    ACTIVE: '#22c55e', LAPSED: '#ef4444', CANCELLED: '#6b7280', PENDING_RENEWAL: '#f59e0b',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Policies</h1>
        <button onClick={() => setShowForm(true)}>+ Add Policy</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16 }}>
          <h3 style={{ marginTop: 0 }}>New Policy</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
              <option value="">Select Client</option>
              {clients.map((c) => <option key={c.clientId} value={c.clientId}>{c.name}</option>)}
            </select>
            <input required placeholder="Insurer" value={form.insurer} onChange={(e) => setForm({ ...form, insurer: e.target.value })} />
            <input placeholder="Policy Number" value={form.policyNumber} onChange={(e) => setForm({ ...form, policyNumber: e.target.value })} />
            <input placeholder="Policy Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            <input required type="number" placeholder="Premium (NAD)" value={form.premium} onChange={(e) => setForm({ ...form, premium: e.target.value })} />
            <input type="number" placeholder="Commission (NAD)" value={form.commission} onChange={(e) => setForm({ ...form, commission: e.target.value })} />
            <input type="date" placeholder="Renewal Date" value={form.renewalDate} onChange={(e) => setForm({ ...form, renewalDate: e.target.value })} />
          </div>
          <div style={{ marginTop: 12 }}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <div>Loading…</div> : (
        <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse', borderRadius: 8 }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={th}>Policy #</th><th style={th}>Insurer</th><th style={th}>Premium</th><th style={th}>Status</th><th style={th}>Renewal</th><th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr key={p.policyId}>
                <td style={td}>{p.policyNumber ?? p.policyId.slice(0, 8)}</td>
                <td style={td}>{p.insurer}</td>
                <td style={td}>NAD {p.premium.toFixed(2)}</td>
                <td style={td}><span style={{ color: statusColor[p.status], fontWeight: 600 }}>{p.status}</span></td>
                <td style={td}>{p.renewalDate ?? '—'}</td>
                <td style={td}><Link to={`/policies/${p.policyId}`}>View</Link></td>
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
