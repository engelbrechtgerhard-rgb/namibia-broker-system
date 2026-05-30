import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePolicies } from '../../hooks/usePolicies';
import { useClients } from '../../hooks/useClients';
export default function PolicyList({ tenantId }) {
    const { policies, loading, createPolicy } = usePolicies(tenantId);
    const { clients } = useClients(tenantId);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ clientId: '', insurer: '', policyNumber: '', premium: '', commission: '', renewalDate: '', type: '' });
    const handleCreate = async (e) => {
        e.preventDefault();
        await createPolicy({ ...form, premium: Number(form.premium), commission: Number(form.commission), status: 'ACTIVE' });
        setShowForm(false);
    };
    const statusColor = {
        ACTIVE: '#22c55e', LAPSED: '#ef4444', CANCELLED: '#6b7280', PENDING_RENEWAL: '#f59e0b',
    };
    return (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }, children: [_jsx("h1", { style: { margin: 0 }, children: "Policies" }), _jsx("button", { onClick: () => setShowForm(true), children: "+ Add Policy" })] }), showForm && (_jsxs("form", { onSubmit: handleCreate, style: { background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16 }, children: [_jsx("h3", { style: { marginTop: 0 }, children: "New Policy" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }, children: [_jsxs("select", { required: true, value: form.clientId, onChange: (e) => setForm({ ...form, clientId: e.target.value }), children: [_jsx("option", { value: "", children: "Select Client" }), clients.map((c) => _jsx("option", { value: c.clientId, children: c.name }, c.clientId))] }), _jsx("input", { required: true, placeholder: "Insurer", value: form.insurer, onChange: (e) => setForm({ ...form, insurer: e.target.value }) }), _jsx("input", { placeholder: "Policy Number", value: form.policyNumber, onChange: (e) => setForm({ ...form, policyNumber: e.target.value }) }), _jsx("input", { placeholder: "Policy Type", value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }) }), _jsx("input", { required: true, type: "number", placeholder: "Premium (NAD)", value: form.premium, onChange: (e) => setForm({ ...form, premium: e.target.value }) }), _jsx("input", { type: "number", placeholder: "Commission (NAD)", value: form.commission, onChange: (e) => setForm({ ...form, commission: e.target.value }) }), _jsx("input", { type: "date", placeholder: "Renewal Date", value: form.renewalDate, onChange: (e) => setForm({ ...form, renewalDate: e.target.value }) })] }), _jsxs("div", { style: { marginTop: 12 }, children: [_jsx("button", { type: "submit", children: "Save" }), _jsx("button", { type: "button", onClick: () => setShowForm(false), style: { marginLeft: 8 }, children: "Cancel" })] })] })), loading ? _jsx("div", { children: "Loading\u2026" }) : (_jsxs("table", { style: { width: '100%', background: '#fff', borderCollapse: 'collapse', borderRadius: 8 }, children: [_jsx("thead", { children: _jsxs("tr", { style: { background: '#f0f0f0' }, children: [_jsx("th", { style: th, children: "Policy #" }), _jsx("th", { style: th, children: "Insurer" }), _jsx("th", { style: th, children: "Premium" }), _jsx("th", { style: th, children: "Status" }), _jsx("th", { style: th, children: "Renewal" }), _jsx("th", { style: th, children: "Actions" })] }) }), _jsx("tbody", { children: policies.map((p) => (_jsxs("tr", { children: [_jsx("td", { style: td, children: p.policyNumber ?? p.policyId.slice(0, 8) }), _jsx("td", { style: td, children: p.insurer }), _jsxs("td", { style: td, children: ["NAD ", p.premium.toFixed(2)] }), _jsx("td", { style: td, children: _jsx("span", { style: { color: statusColor[p.status], fontWeight: 600 }, children: p.status }) }), _jsx("td", { style: td, children: p.renewalDate ?? '—' }), _jsx("td", { style: td, children: _jsx(Link, { to: `/policies/${p.policyId}`, children: "View" }) })] }, p.policyId))) })] }))] }));
}
const th = { padding: '10px 12px', textAlign: 'left', fontWeight: 600 };
const td = { padding: '10px 12px', borderTop: '1px solid #eee' };
