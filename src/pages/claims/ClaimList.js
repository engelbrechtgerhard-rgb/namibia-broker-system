import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClaims } from '../../hooks/useClaims';
import { usePolicies } from '../../hooks/usePolicies';
export default function ClaimList({ tenantId }) {
    const { claims, loading, logClaim } = useClaims(tenantId);
    const { policies } = usePolicies(tenantId);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ policyId: '', clientId: '', description: '', incidentDate: '' });
    const handleCreate = async (e) => {
        e.preventDefault();
        const policy = policies.find((p) => p.policyId === form.policyId);
        await logClaim({ ...form, clientId: policy?.clientId ?? form.clientId });
        setShowForm(false);
    };
    const statusColor = {
        FNOL: '#3b82f6', UNDER_REVIEW: '#f59e0b', APPROVED: '#22c55e', REJECTED: '#ef4444', CLOSED: '#6b7280',
    };
    return (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }, children: [_jsx("h1", { style: { margin: 0 }, children: "Claims" }), _jsx("button", { onClick: () => setShowForm(true), children: "+ Log Claim (FNOL)" })] }), showForm && (_jsxs("form", { onSubmit: handleCreate, style: { background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16 }, children: [_jsx("h3", { style: { marginTop: 0 }, children: "Log FNOL" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }, children: [_jsxs("select", { required: true, value: form.policyId, onChange: (e) => setForm({ ...form, policyId: e.target.value }), children: [_jsx("option", { value: "", children: "Select Policy" }), policies.map((p) => _jsxs("option", { value: p.policyId, children: [p.policyNumber ?? p.policyId.slice(0, 8), " \u2014 ", p.insurer] }, p.policyId))] }), _jsx("input", { type: "date", placeholder: "Incident Date", value: form.incidentDate, onChange: (e) => setForm({ ...form, incidentDate: e.target.value }) }), _jsx("textarea", { required: true, placeholder: "Description of incident\u2026", value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), style: { gridColumn: '1 / -1', height: 80 } })] }), _jsxs("div", { style: { marginTop: 12 }, children: [_jsx("button", { type: "submit", children: "Submit FNOL" }), _jsx("button", { type: "button", onClick: () => setShowForm(false), style: { marginLeft: 8 }, children: "Cancel" })] })] })), loading ? _jsx("div", { children: "Loading\u2026" }) : (_jsxs("table", { style: { width: '100%', background: '#fff', borderCollapse: 'collapse', borderRadius: 8 }, children: [_jsx("thead", { children: _jsxs("tr", { style: { background: '#f0f0f0' }, children: [_jsx("th", { style: th, children: "Claim ID" }), _jsx("th", { style: th, children: "Policy" }), _jsx("th", { style: th, children: "Status" }), _jsx("th", { style: th, children: "Incident Date" }), _jsx("th", { style: th, children: "Actions" })] }) }), _jsx("tbody", { children: claims.map((c) => (_jsxs("tr", { children: [_jsxs("td", { style: td, children: [c.claimId.slice(0, 8), "\u2026"] }), _jsxs("td", { style: td, children: [c.policyId.slice(0, 8), "\u2026"] }), _jsx("td", { style: td, children: _jsx("span", { style: { color: statusColor[c.status], fontWeight: 600 }, children: c.status }) }), _jsx("td", { style: td, children: c.incidentDate ?? '—' }), _jsx("td", { style: td, children: _jsx(Link, { to: `/claims/${c.claimId}`, children: "View" }) })] }, c.claimId))) })] }))] }));
}
const th = { padding: '10px 12px', textAlign: 'left', fontWeight: 600 };
const td = { padding: '10px 12px', borderTop: '1px solid #eee' };
