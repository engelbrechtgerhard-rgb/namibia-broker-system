import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePolicies } from '../../hooks/usePolicies';
import { apiClient } from '../../lib/apiClient';

interface Props { tenantId: string }

export default function PolicyDetail({ tenantId }: Props) {
  const { policyId } = useParams<{ policyId: string }>();
  const { policies, loading, updatePolicy } = usePolicies(tenantId);
  const [endorseForm, setEndorseForm] = useState({ endorsementNote: '', effectiveDate: '' });
  const [showEndorse, setShowEndorse] = useState(false);

  const policy = policies.find((p) => p.policyId === policyId);

  if (loading) return <div>Loading…</div>;
  if (!policy) return <div>Policy not found. <Link to="/policies">Back</Link></div>;

  const handleEndorse = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiClient.post(`/policies/${policyId}/endorse`, endorseForm, tenantId);
    setShowEndorse(false);
    alert('Endorsement saved');
  };

  const handleStatusChange = async (status: string) => {
    await updatePolicy(policyId!, { status: status as typeof policy.status });
  };

  return (
    <div>
      <Link to="/policies">← Back to Policies</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ marginTop: 8 }}>{policy.policyNumber ?? policyId}</h1>
        <button onClick={() => setShowEndorse(true)}>+ Endorsement</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[
          ['Insurer', policy.insurer], ['Type', policy.type ?? '—'], ['Premium', `NAD ${policy.premium.toFixed(2)}`],
          ['Commission', `NAD ${policy.commission?.toFixed(2) ?? '—'}`], ['Status', policy.status],
          ['Renewal Date', policy.renewalDate ?? '—'], ['Inception Date', policy.inceptionDate ?? '—'],
        ].map(([label, value]) => (
          <div key={label} style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{label}</p>
            <p style={{ margin: 0, fontWeight: 500 }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Update Status</h3>
        <select onChange={(e) => handleStatusChange(e.target.value)} defaultValue={policy.status}>
          {['ACTIVE', 'LAPSED', 'CANCELLED', 'PENDING_RENEWAL'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {showEndorse && (
        <form onSubmit={handleEndorse} style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>New Endorsement</h3>
          <input required type="date" value={endorseForm.effectiveDate} onChange={(e) => setEndorseForm({ ...endorseForm, effectiveDate: e.target.value })} style={{ display: 'block', marginBottom: 8 }} />
          <textarea required placeholder="Endorsement note…" value={endorseForm.endorsementNote} onChange={(e) => setEndorseForm({ ...endorseForm, endorsementNote: e.target.value })} style={{ width: '100%', height: 80 }} />
          <div style={{ marginTop: 8 }}>
            <button type="submit">Save Endorsement</button>
            <button type="button" onClick={() => setShowEndorse(false)} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
