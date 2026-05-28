import { usePolicies } from '../../hooks/usePolicies';
import { useClaims } from '../../hooks/useClaims';
import { useReports } from '../../hooks/useReports';
import Papa from 'papaparse';

interface Props { tenantId: string }

export default function Reports({ tenantId }: Props) {
  const { summary, loading } = useReports(tenantId);
  const { policies } = usePolicies(tenantId);
  const { claims } = useClaims(tenantId);

  const exportCSV = (data: object[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Reports</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard title="Active Policies" value={summary?.activePolicies ?? 0} />
        <StatCard title="Open Claims" value={summary?.openClaims ?? 0} />
        <StatCard title="Total Premium (NAD)" value={(summary?.totalPremium ?? 0).toFixed(2)} />
        <StatCard title="Total Commission (NAD)" value={(summary?.totalCommission ?? 0).toFixed(2)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ReportSection
          title="Policies"
          count={policies.length}
          onExport={() => exportCSV(policies, 'policies.csv')}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f0f0f0' }}>
              <th style={th}>Policy #</th><th style={th}>Insurer</th><th style={th}>Status</th><th style={th}>Premium</th>
            </tr></thead>
            <tbody>
              {policies.slice(0, 10).map((p) => (
                <tr key={p.policyId}>
                  <td style={td}>{p.policyNumber ?? p.policyId.slice(0, 8)}</td>
                  <td style={td}>{p.insurer}</td>
                  <td style={td}>{p.status}</td>
                  <td style={td}>NAD {p.premium.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>

        <ReportSection
          title="Claims"
          count={claims.length}
          onExport={() => exportCSV(claims, 'claims.csv')}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f0f0f0' }}>
              <th style={th}>Claim ID</th><th style={th}>Status</th><th style={th}>Date</th>
            </tr></thead>
            <tbody>
              {claims.slice(0, 10).map((c) => (
                <tr key={c.claimId}>
                  <td style={td}>{c.claimId.slice(0, 8)}…</td>
                  <td style={td}>{c.status}</td>
                  <td style={td}>{c.incidentDate ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <p style={{ margin: 0, fontSize: 13, color: '#666' }}>{title}</p>
      <p style={{ margin: 0, fontSize: 26, fontWeight: 600 }}>{value}</p>
    </div>
  );
}

function ReportSection({ title, count, onExport, children }: { title: string; count: number; onExport: () => void; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>{title} ({count})</h3>
        <button onClick={onExport} style={{ fontSize: 12 }}>Export CSV</button>
      </div>
      {children}
    </div>
  );
}

const th: React.CSSProperties = { padding: '8px 10px', textAlign: 'left', fontWeight: 600 };
const td: React.CSSProperties = { padding: '8px 10px', borderTop: '1px solid #eee' };
