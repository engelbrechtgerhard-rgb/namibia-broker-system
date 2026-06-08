import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from 'react-router-dom';
import { useClaims } from '../../hooks/useClaims';
export default function ClaimDetail({ tenantId }) {
    const { claimId } = useParams();
    const { claims, loading, updateClaimStatus } = useClaims(tenantId);
    const claim = claims.find((c) => c.claimId === claimId);
    if (loading)
        return _jsx("div", { children: "Loading\u2026" });
    if (!claim)
        return _jsxs("div", { children: ["Claim not found. ", _jsx(Link, { to: "/claims", children: "Back" })] });
    const statuses = ['FNOL', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED'];
    return (_jsxs("div", { children: [_jsx(Link, { to: "/claims", children: "\u2190 Back to Claims" }), _jsxs("h1", { style: { marginTop: 8 }, children: ["Claim ", claimId?.slice(0, 8), "\u2026"] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }, children: [
                    ['Status', claim.status], ['Policy ID', claim.policyId.slice(0, 8)],
                    ['Incident Date', claim.incidentDate ?? '—'], ['Logged', new Date(claim.createdAt).toLocaleDateString()],
                ].map(([label, value]) => (_jsxs("div", { style: { background: '#fff', padding: 16, borderRadius: 8 }, children: [_jsx("p", { style: { margin: 0, fontSize: 12, color: '#888' }, children: label }), _jsx("p", { style: { margin: 0, fontWeight: 500 }, children: value })] }, label))) }), _jsxs("div", { style: { background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16 }, children: [_jsx("h3", { style: { marginTop: 0 }, children: "Description" }), _jsx("p", { children: claim.description })] }), _jsxs("div", { style: { background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }, children: [_jsx("h3", { style: { marginTop: 0 }, children: "Update Status" }), _jsx("select", { defaultValue: claim.status, onChange: (e) => updateClaimStatus(claimId, e.target.value), children: statuses.map((s) => _jsx("option", { value: s, children: s }, s)) })] }), claim.events && claim.events.length > 0 && (_jsxs("div", { style: { background: '#fff', padding: 24, borderRadius: 8 }, children: [_jsx("h3", { style: { marginTop: 0 }, children: "Event History" }), claim.events.map((ev) => (_jsxs("div", { style: { padding: '8px 0', borderBottom: '1px solid #eee' }, children: [_jsx("span", { style: { fontWeight: 600 }, children: ev.type }), _jsx("span", { style: { marginLeft: 12, color: '#666' }, children: ev.message }), _jsx("span", { style: { float: 'right', fontSize: 12, color: '#aaa' }, children: new Date(ev.createdAt).toLocaleString() })] }, ev.eventId)))] }))] }));
}
