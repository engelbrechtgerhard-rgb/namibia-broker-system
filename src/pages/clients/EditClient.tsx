import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@/layout/PageLayout";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { getClientById, updateClient } from "@/api/clients";
import { useAuth } from "react-oidc-context";
import styles from "./Clients.module.css";
import { listClientTypes } from "@/api/clientTypes";

export default function EditClient() {
  const { clientId } = useParams<{ clientId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientTypes, setClientTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    type: "",
    firstName: "",
    lastName: "",
    idNumber: "",
    title: "",
    email: "",
    phone: "",
    companyName: "",
    taxNumber: "",
    vatNumber: "",
    address: "",
    contactFirstName: "",
    contactLastName: "",
    contactIdNumber: "",
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",
  });
  const selectedType = clientTypes.find(t => t.name === form.type);
  const category = selectedType?.category; // "INDIVIDUAL" or "COMPANY"

  useEffect(() => {
    if (!user?.id_token) return;

    const tenantId = user.profile?.["custom:tenantId"] as string;

    listClientTypes(user.id_token, tenantId).then(setClientTypes);
  }, [user?.id_token]);

  useEffect(() => {
    if (!clientId || !user?.id_token) return;

    getClientById(user.id_token, clientId)
      .then((client) => {
        if (!client) return;

        setForm({
          // Individual fields
          firstName: client.firstName ?? "",
          lastName: client.lastName ?? "",
          idNumber: client.idNumber ?? "",
          title: client.title ?? "",
          email: client.email ?? "",
          phone: client.phone ?? "",

          // Company fields
          companyName: client.companyName ?? "",
          taxNumber: client.taxNumber ?? "",
          vatNumber: client.vatNumber ?? "",

          // Shared
          address: client.address ?? "",

          // Contact person
          contactFirstName: client.contactFirstName ?? "",
          contactLastName: client.contactLastName ?? "",
          contactIdNumber: client.contactIdNumber ?? "",
          contactTitle: client.contactTitle ?? "",
          contactEmail: client.contactEmail ?? "",
          contactPhone: client.contactPhone ?? "",

          // Type
          type: client.type ?? "",
        });
      })
      .finally(() => setLoading(false));
  }, [clientId, user?.id_token]);

  useEffect(() => {
    if (category === "INDIVIDUAL") {
      setForm(f => ({
        ...f,
        companyName: "",
        taxNumber: "",
        vatNumber: "",
        contactFirstName: "",
        contactLastName: "",
        contactIdNumber: "",
        contactTitle: "",
        contactEmail: "",
        contactPhone: "",
      }));
    }

    if (category === "COMPANY") {
      setForm(f => ({
        ...f,
        firstName: "",
        lastName: "",
        idNumber: "",
        title: "",
        email: "",
        phone: "",
      }));
    }
  }, [category]);
  
  function updateField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !user?.id_token) return;

    const tenantId = user?.profile?.["custom:tenantId"] as string;

    await updateClient(user.id_token, clientId, {
      ...form,
      tenantId,
    });

    navigate(`/clients/${clientId}`);
  }

  if (loading) {
    return <PageLayout title="Edit Client">Loading…</PageLayout>;
  }

  return (
    <PageLayout title="Edit Client">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Card title="Edit Client Details">
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Type</label>
              <select
                value={form.type ?? ""}
                onChange={(e) => updateField("type", e.target.value)}
                required
              >
                <option value="">Select type…</option>
                {clientTypes.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {category === "INDIVIDUAL" && (
              <>
                <div className={styles.field}>
                  <label>First Name</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Last Name</label>
                  <input
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>ID Number</label>
                  <input
                    value={form.idNumber}
                    onChange={(e) => updateField("idNumber", e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label>Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label>Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label>Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>
              </>
            )}

            {category === "COMPANY" && (
              <>
                <div className={styles.field}>
                  <label>Company Name</label>
                  <input
                    value={form.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Tax Number</label>
                  <input
                    value={form.taxNumber}
                    onChange={(e) => updateField("taxNumber", e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label>VAT Number</label>
                  <input
                    value={form.vatNumber}
                    onChange={(e) => updateField("vatNumber", e.target.value)}
                  />
                </div>

                <h3>Contact Person</h3>

                <div className={styles.field}>
                  <label>First Name</label>
                  <input
                    value={form.contactFirstName}
                    onChange={(e) => updateField("contactFirstName", e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label>Last Name</label>
                  <input
                    value={form.contactLastName}
                    onChange={(e) => updateField("contactLastName", e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label>ID Number</label>
                  <input
                    value={form.contactIdNumber}
                    onChange={(e) => updateField("contactIdNumber", e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label>Title</label>
                  <input
                    value={form.contactTitle}
                    onChange={(e) => updateField("contactTitle", e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label>Email</label>
                  <input
                    value={form.contactEmail}
                    onChange={(e) => updateField("contactEmail", e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label>Phone</label>
                  <input
                    value={form.contactPhone}
                    onChange={(e) => updateField("contactPhone", e.target.value)}
                  />
                </div>
              </>
            )}

            <div className={styles.field}>
              <label>Address</label>
              <input
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>

          </div>
        </Card>

        <Button type="submit" variant="primary" className={styles.saveButton}>
          Save Changes
        </Button>
      </form>
    </PageLayout>
  );
}
