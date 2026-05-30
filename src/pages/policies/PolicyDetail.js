import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePolicies } from '../../hooks/usePolicies';
import { apiClient } from '../../lib/apiClient';
export default function PolicyDetail({ tenantId }) {
    const { policyId } = useParams();
    const { policies, loading, updatePolicy } = usePolicies(tenantId);
    const [endorseForm, setEndorseForm] = useState({ endorsementNote: '', effectiveDate: '' });
    const [showEndorse, setShowEndorse] = useState(false);
    const policy = policies.find((p) => p.policyId === policyId);
    if (loading)
        return _jsx("div", { children: "Loading\u2026" });
    if (!policy)
        return _jsxs("div", { children: ["Policy not found. ", _jsx(Link, { to: "/policies", children: "Back" })] });
    const handleEndorse = async (e) => {
        e.preventDefault();
        await apiClient.post(`/policies/${policyId}/endorse`, endorseForm, tenantId);
        setShowEndorse(false);
        alert('Endorsement saved');
    };
    const handleStatusChange = async (status) => {
        await updatePolicy(policyId, { status: status });
    };
    return (_jsxs("div", { children: [_jsx(Link, { to: "/policies", children: "\u2190 Back to Policies" }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("h1", { style: { marginTop: 8 }, children: policy.policyNumber ?? policyId }), _jsx("button", { onClick: () => setShowEndorse(true), children: "+ Endorsement" })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }, children: [
                    ['Insurer', policy.insurer], ['Type', policy.type ?? '—'], ['Premium', `NAD ${policy.premium.toFixed(2)}`],
                    ['Commission', `NAD ${policy.commission?.toFixed(2) ?? '—'}`], ['Status', policy.status],
                    ['Renewal Date', policy.renewalDate ?? '—'], ['Inception Date', policy.inceptionDate ?? '—'],
                ].map(([label, value]) => (_jsxs("div", { style: { background: '#fff', padding: 16, borderRadius: 8 }, children: [_jsx("p", { style: { margin: 0, fontSize: 12, color: '#888' }, children: label }), _jsx("p", { style: { margin: 0, fontWeight: 500 }, children: value })] }, label))) }), _jsxs("div", { style: { background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }, children: [_jsx("h3", { style: { marginTop: 0 }, children: "Update Status" }), _jsx("select", { onChange: (e) => handleStatusChange(e.target.value), defaultValue: policy.status, children: ['ACTIVE', 'LAPSED', 'CANCELLED', 'PENDING_RENEWAL'].map((s) => _jsx("option", { value: s, children: s }, s)) })] }), showEndorse && (_jsxs("form", { onSubmit: handleEndorse, style: { background: '#fff', padding: 24, borderRadius: 8 }, children: [_jsx("h3", { style: { marginTop: 0 }, children: "New Endorsement" }), _jsx("input", { required: true, type: "date", value: endorseForm.effectiveDate, onChange: (e) => setEndorseForm({ ...endorseForm, effectiveDate: e.target.value }), style: { display: 'block', marginBottom: 8 } }), _jsx("textarea", { required: true, placeholder: "Endorsement note\u2026", value: endorseForm.endorsementNote, onChange: (e) => setEndorseForm({ ...endorseForm, endorsementNote: e.target.value }), style: { width: '100%', height: 80 } }), _jsxs("div", { style: { marginTop: 8 }, children: [_jsx("button", { type: "submit", children: "Save Endorsement" }), _jsx("button", { type: "button", onClick: () => setShowEndorse(false), style: { marginLeft: 8 }, children: "Cancel" })] })] }))] }));
}
