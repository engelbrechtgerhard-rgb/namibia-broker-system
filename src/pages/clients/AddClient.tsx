import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { createClient } from "@/api/clients";
import { listClientTypes } from "@/api/clientTypes";
import PageLayout from "@/layout/PageLayout";
import Button from "@/components/Button";
import Card from "@/components/Card";
import styles from "./Clients.module.css";

export default function AddClient() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientTypes, setClientTypes] = useState<any[]>([]);
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

  function updateField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id_token) return;

    const profile = user.profile as Record<string, unknown>;
    const tenantId =
      typeof profile["custom:tenantId"] === "string"
        ? profile["custom:tenantId"]
        : "";

    if (!tenantId) return;

    const newClient = await createClient(user.id_token, tenantId, form);
    navigate(`/clients/${newClient.id}`);
  }

  return (
    <PageLayout title="Add Client">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Card title="Client Details">
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
          Save Client
        </Button>
      </form>
    </PageLayout>
  );
}
