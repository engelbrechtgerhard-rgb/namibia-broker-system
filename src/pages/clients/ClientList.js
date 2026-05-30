import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClients } from '../../hooks/useClients';
export default function ClientList({ tenantId }) {
    const { clients, loading, createClient } = useClients(tenantId);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'INDIVIDUAL' });
    const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    const handleCreate = async (e) => {
        e.preventDefault();
        await createClient(form);
        setShowForm(false);
        setForm({ name: '', email: '', phone: '', type: 'INDIVIDUAL' });
    };
    return (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }, children: [_jsx("h1", { style: { margin: 0 }, children: "Clients" }), _jsx("button", { onClick: () => setShowForm(true), children: "+ Add Client" })] }), _jsx("input", { placeholder: "Search clients\u2026", value: search, onChange: (e) => setSearch(e.target.value), style: { marginBottom: 16, padding: 8, width: 300 } }), showForm && (_jsxs("form", { onSubmit: handleCreate, style: { background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16 }, children: [_jsx("h3", { style: { marginTop: 0 }, children: "New Client" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }, children: [_jsx("input", { required: true, placeholder: "Full Name", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) }), _jsx("input", { placeholder: "Email", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }) }), _jsx("input", { placeholder: "Phone", value: form.phone, onChange: (e) => setForm({ ...form, phone: e.target.value }) }), _jsxs("select", { value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), children: [_jsx("option", { value: "INDIVIDUAL", children: "Individual" }), _jsx("option", { value: "CORPORATE", children: "Corporate" })] })] }), _jsxs("div", { style: { marginTop: 12 }, children: [_jsx("button", { type: "submit", children: "Save" }), _jsx("button", { type: "button", onClick: () => setShowForm(false), style: { marginLeft: 8 }, children: "Cancel" })] })] })), loading ? _jsx("div", { children: "Loading\u2026" }) : (_jsxs("table", { style: { width: '100%', background: '#fff', borderCollapse: 'collapse', borderRadius: 8 }, children: [_jsx("thead", { children: _jsxs("tr", { style: { background: '#f0f0f0' }, children: [_jsx("th", { style: th, children: "Name" }), _jsx("th", { style: th, children: "Type" }), _jsx("th", { style: th, children: "Email" }), _jsx("th", { style: th, children: "Phone" }), _jsx("th", { style: th, children: "Actions" })] }) }), _jsx("tbody", { children: filtered.map((c) => (_jsxs("tr", { children: [_jsx("td", { style: td, children: c.name }), _jsx("td", { style: td, children: c.type }), _jsx("td", { style: td, children: c.email }), _jsx("td", { style: td, children: c.phone }), _jsx("td", { style: td, children: _jsx(Link, { to: `/clients/${c.clientId}`, children: "View" }) })] }, c.clientId))) })] }))] }));
}
const th = { padding: '10px 12px', textAlign: 'left', fontWeight: 600 };
const td = { padding: '10px 12px', borderTop: '1px solid #eee' };
