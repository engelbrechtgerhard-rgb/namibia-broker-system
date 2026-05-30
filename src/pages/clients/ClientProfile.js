import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from 'react-router-dom';
import { useClients } from '../../hooks/useClients';
import { usePolicies } from '../../hooks/usePolicies';
import { useClaims } from '../../hooks/useClaims';
export default function ClientProfile({ tenantId }) {
    const { clientId } = useParams();
    const { clients, loading } = useClients(tenantId);
    const { policies } = usePolicies(tenantId);
    const { claims } = useClaims(tenantId);
    const client = clients.find((c) => c.clientId === clientId);
    const clientPolicies = policies.filter((p) => p.clientId === clientId);
    const clientClaims = claims.filter((c) => c.clientId === clientId);
    if (loading)
        return _jsx("div", { children: "Loading\u2026" });
    if (!client)
        return _jsxs("div", { children: ["Client not found. ", _jsx(Link, { to: "/clients", children: "Back" })] });
    return (_jsxs("div", { children: [_jsx(Link, { to: "/clients", children: "\u2190 Back to Clients" }), _jsx("h1", { style: { marginTop: 8 }, children: client.name }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }, children: [_jsx(InfoCard, { label: "Type", value: client.type }), _jsx(InfoCard, { label: "Email", value: client.email ?? '—' }), _jsx(InfoCard, { label: "Phone", value: client.phone ?? '—' }), _jsx(InfoCard, { label: "ID Number", value: client.idNumber ?? '—' }), _jsx(InfoCard, { label: "Address", value: client.address ?? '—' }), _jsx(InfoCard, { label: "Member Since", value: new Date(client.createdAt).toLocaleDateString() })] }), _jsx(Section, { title: `Policies (${clientPolicies.length})`, children: clientPolicies.map((p) => (_jsxs("div", { style: { padding: '8px 0', borderBottom: '1px solid #eee' }, children: [_jsx(Link, { to: `/policies/${p.policyId}`, children: p.policyNumber ?? p.policyId }), _jsxs("span", { style: { marginLeft: 12, color: '#666' }, children: [p.insurer, " \u2014 ", p.status] })] }, p.policyId))) }), _jsx(Section, { title: `Claims (${clientClaims.length})`, children: clientClaims.map((c) => (_jsxs("div", { style: { padding: '8px 0', borderBottom: '1px solid #eee' }, children: [_jsxs(Link, { to: `/claims/${c.claimId}`, children: [c.claimId.slice(0, 8), "\u2026"] }), _jsxs("span", { style: { marginLeft: 12, color: '#666' }, children: [c.status, " \u2014 ", c.description.slice(0, 60)] })] }, c.claimId))) })] }));
}
function InfoCard({ label, value }) {
    return (_jsxs("div", { style: { background: '#fff', padding: 16, borderRadius: 8 }, children: [_jsx("p", { style: { margin: 0, fontSize: 12, color: '#888' }, children: label }), _jsx("p", { style: { margin: 0, fontWeight: 500 }, children: value })] }));
}
function Section({ title, children }) {
    return (_jsxs("div", { style: { background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16 }, children: [_jsx("h3", { style: { marginTop: 0 }, children: title }), children] }));
}
