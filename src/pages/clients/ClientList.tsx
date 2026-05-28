import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClients } from '../../hooks/useClients';
import type { Client } from '../../types';

interface Props { tenantId: string }

export default function ClientList({ tenantId }: Props) {
  const { clients, loading, createClient } = useClients(tenantId);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'INDIVIDUAL' as Client['type'] });

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createClient(form);
    setShowForm(false);
    setForm({ name: '', email: '', phone: '', type: 'INDIVIDUAL' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Clients</h1>
        <button onClick={() => setShowForm(true)}>+ Add Client</button>
      </div>

      <input
        placeholder="Search clients…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16, padding: 8, width: 300 }}
      />

      {showForm && (
        <form onSubmit={handleCreate} style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16 }}>
          <h3 style={{ marginTop: 0 }}>New Client</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Client['type'] })}>
              <option value="INDIVIDUAL">Individual</option>
              <option value="CORPORATE">Corporate</option>
            </select>
          </div>
          <div style={{ marginTop: 12 }}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <div>Loading…</div> : (
        <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse', borderRadius: 8 }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={th}>Name</th><th style={th}>Type</th><th style={th}>Email</th><th style={th}>Phone</th><th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.clientId}>
                <td style={td}>{c.name}</td>
                <td style={td}>{c.type}</td>
                <td style={td}>{c.email}</td>
                <td style={td}>{c.phone}</td>
                <td style={td}><Link to={`/clients/${c.clientId}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: '10px 12px', textAlign: 'left', fontWeight: 600 };
const td: React.CSSProperties = { padding: '10px 12px', borderTop: '1px solid #eee' };
