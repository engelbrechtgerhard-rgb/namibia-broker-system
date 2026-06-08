import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listClients } from "../../api/clients";
export default function Clients() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    // Load clients from Amplify Data API
    useEffect(() => {
        listClients()
            .then(setClients)
            .finally(() => setLoading(false));
    }, []);
    // Search filter based on the "name" field in your schema
    const filtered = clients.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()));
    return (_jsxs("div", { children: [_jsxs("div", { style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }, children: [_jsx("h1", { style: { margin: 0 }, children: "Clients" }), _jsx("button", { onClick: () => navigate("/clients/add"), children: "+ Add Client" })] }), _jsx("input", { placeholder: "Search clients\u2026", value: search, onChange: (e) => setSearch(e.target.value), style: { marginBottom: 16, padding: 8, width: 300 } }), loading ? (_jsx("div", { children: "Loading\u2026" })) : (_jsxs("table", { style: {
                    width: "100%",
                    background: "#fff",
                    borderCollapse: "collapse",
                    borderRadius: 8,
                }, children: [_jsx("thead", { children: _jsxs("tr", { style: { background: "#f0f0f0" }, children: [_jsx("th", { style: th, children: "Name" }), _jsx("th", { style: th, children: "Type" }), _jsx("th", { style: th, children: "Email" }), _jsx("th", { style: th, children: "Phone" }), _jsx("th", { style: th, children: "Actions" })] }) }), _jsx("tbody", { children: filtered.map((c) => (_jsxs("tr", { children: [_jsx("td", { style: td, children: c.name }), _jsx("td", { style: td, children: c.type }), _jsx("td", { style: td, children: c.email }), _jsx("td", { style: td, children: c.phone }), _jsx("td", { style: td, children: _jsx(Link, { to: `/clients/${c.id}`, children: "View" }) })] }, c.id))) })] }))] }));
}
const th = {
    padding: "10px 12px",
    textAlign: "left",
    fontWeight: 600,
};
const td = {
    padding: "10px 12px",
    borderTop: "1px solid #eee",
};
