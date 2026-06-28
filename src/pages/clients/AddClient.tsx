import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/layout/PageLayout";
import Button from "@/components/Button";
import { createClient } from "@/api/clients";

export default function AddClient() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
  });

  function updateField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newClient = await createClient(form);
    navigate(`/clients/${newClient.id}`);
  }

  return (
    <PageLayout title="Add Client">
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <label>First Name</label>
        <input
          value={form.firstName}
          onChange={(e) => updateField("firstName", e.target.value)}
        />

        <label>Last Name</label>
        <input
          value={form.lastName}
          onChange={(e) => updateField("lastName", e.target.value)}
        />

        <label>Email</label>
        <input
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />

        <label>Phone</label>
        <input
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
        />

        <label>ID Number</label>
        <input
          value={form.idNumber}
          onChange={(e) => updateField("idNumber", e.target.value)}
        />

        <Button type="submit" variant="primary" style={{ marginTop: 16 }}>
          Save Client
        </Button>
      </form>
    </PageLayout>
  );
}
