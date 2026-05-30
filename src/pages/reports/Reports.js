import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePolicies } from '../../hooks/usePolicies';
import { useClaims } from '../../hooks/useClaims';
import { useReports } from '../../hooks/useReports';
import Papa from 'papaparse';
export default function Reports({ tenantId }) {
    const { summary, loading } = useReports(tenantId);
    const { policies } = usePolicies(tenantId);
    const { claims } = useClaims(tenantId);
    const exportCSV = (data, filename) => {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };
    if (loading)
        return _jsx("div", { children: "Loading\u2026" });
    return (_jsxs("div", { children: [_jsx("h1", { style: { marginTop: 0 }, children: "Reports" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }, children: [_jsx(StatCard, { title: "Active Policies", value: summary?.activePolicies ?? 0 }), _jsx(StatCard, { title: "Open Claims", value: summary?.openClaims ?? 0 }), _jsx(StatCard, { title: "Total Premium (NAD)", value: (summary?.totalPremium ?? 0).toFixed(2) }), _jsx(StatCard, { title: "Total Commission (NAD)", value: (summary?.totalCommission ?? 0).toFixed(2) })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }, children: [_jsx(ReportSection, { title: "Policies", count: policies.length, onExport: () => exportCSV(policies, 'policies.csv'), children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { background: '#f0f0f0' }, children: [_jsx("th", { style: th, children: "Policy #" }), _jsx("th", { style: th, children: "Insurer" }), _jsx("th", { style: th, children: "Status" }), _jsx("th", { style: th, children: "Premium" })] }) }), _jsx("tbody", { children: policies.slice(0, 10).map((p) => (_jsxs("tr", { children: [_jsx("td", { style: td, children: p.policyNumber ?? p.policyId.slice(0, 8) }), _jsx("td", { style: td, children: p.insurer }), _jsx("td", { style: td, children: p.status }), _jsxs("td", { style: td, children: ["NAD ", p.premium.toFixed(2)] })] }, p.policyId))) })] }) }), _jsx(ReportSection, { title: "Claims", count: claims.length, onExport: () => exportCSV(claims, 'claims.csv'), children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { background: '#f0f0f0' }, children: [_jsx("th", { style: th, children: "Claim ID" }), _jsx("th", { style: th, children: "Status" }), _jsx("th", { style: th, children: "Date" })] }) }), _jsx("tbody", { children: claims.slice(0, 10).map((c) => (_jsxs("tr", { children: [_jsxs("td", { style: td, children: [c.claimId.slice(0, 8), "\u2026"] }), _jsx("td", { style: td, children: c.status }), _jsx("td", { style: td, children: c.incidentDate ?? '—' })] }, c.claimId))) })] }) })] })] }));
}
function StatCard({ title, value }) {
    return (_jsxs("div", { style: { background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }, children: [_jsx("p", { style: { margin: 0, fontSize: 13, color: '#666' }, children: title }), _jsx("p", { style: { margin: 0, fontSize: 26, fontWeight: 600 }, children: value })] }));
}
function ReportSection({ title, count, onExport, children }) {
    return (_jsxs("div", { style: { background: '#fff', padding: 24, borderRadius: 8 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }, children: [_jsxs("h3", { style: { margin: 0 }, children: [title, " (", count, ")"] }), _jsx("button", { onClick: onExport, style: { fontSize: 12 }, children: "Export CSV" })] }), children] }));
}
const th = { padding: '8px 10px', textAlign: 'left', fontWeight: 600 };
const td = { padding: '8px 10px', borderTop: '1px solid #eee' };
