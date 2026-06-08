import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listClients } from "../../api/clients";

export default function Clients() {
  const navigate = useNavigate();

  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Load clients from Amplify Data API
  useEffect(() => {
    listClients()
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  // Search filter based on the "name" field in your schema
  const filtered = clients.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Clients</h1>
        <button onClick={() => navigate("/clients/add")}>+ Add Client</button>
      </div>

      {/* Search */}
      <input
        placeholder="Search clients…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16, padding: 8, width: 300 }}
      />

      {/* Table */}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <table
          style={{
            width: "100%",
            background: "#fff",
            borderCollapse: "collapse",
            borderRadius: 8,
          }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={th}>Name</th>
              <th style={th}>Type</th>
              <th style={th}>Email</th>
              <th style={th}>Phone</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td style={td}>{c.name}</td>
                <td style={td}>{c.type}</td>
                <td style={td}>{c.email}</td>
                <td style={td}>{c.phone}</td>
                <td style={td}>
                  <Link to={`/clients/${c.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "10px 12px",
  textAlign: "left",
  fontWeight: 600,
};

const td: React.CSSProperties = {
  padding: "10px 12px",
  borderTop: "1px solid #eee",
};
