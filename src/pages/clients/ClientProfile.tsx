import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { getClientById, deleteClient } from "@/api/clients";
import { listClientTypes } from "@/api/clientTypes";
import { logAudit } from "@/api/audit";
import PageLayout from "@/layout/PageLayout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import styles from "./Clients.module.css";
import TypeBadge from "@/components/TypeBadge";


export default function ClientProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();

  const [client, setClient] = useState<any>(null);
  const [clientTypes, setClientTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  const groups = (user?.profile?.["cognito:groups"] as string[]) ?? [];
  const isAdmin = groups.includes("Admin");

  // Load client types (needed to determine category)
  useEffect(() => {
    if (!user?.id_token) return;
    const tenantId = user.profile?.["custom:tenantId"] as string;
    listClientTypes(user.id_token, tenantId).then(setClientTypes);
  }, [user?.id_token]);

  // Load client
  useEffect(() => {
    if (!clientId || !user?.id_token) return;
    getClientById(user.id_token, clientId)
      .then(setClient)
      .finally(() => setLoading(false));
  }, [clientId, user?.id_token]);

  if (loading) return <PageLayout title="Client Profile">Loading…</PageLayout>;

  if (!client)
    return (
      <PageLayout title="Client Profile">
        Client not found. <Link to="/clients">Back</Link>
      </PageLayout>
    );

  // Determine category (INDIVIDUAL or COMPANY)
  const selectedType = clientTypes.find(t => t.name === client.type);
  const category = selectedType?.category;

  async function handleDelete() {
    if (!user?.id_token || !clientId) return;

    const tenantId = user.profile?.["custom:tenantId"] as string;

    await deleteClient(user.id_token, clientId);

    await logAudit(user.id_token, {
      tenantId,
      entityType: "Client",
      entityId: clientId,
      action: "DELETE",
      performedBy: user.profile.email ?? user.profile.sub ?? "unknown",
      performedByName: `${user.profile.given_name ?? ""} ${user.profile.family_name ?? ""}`.trim(),
      timestamp: new Date().toISOString(),
      details: "Client deleted from ClientProfile page",
    });

    navigate("/clients");
  }

  const pageTitle =
    category === "COMPANY"
      ? client.companyName || "Client Profile"
      : `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim();

  return (
    <PageLayout title={pageTitle}>
      <Link to="/clients">← Back to Clients</Link>

      <div className="mt-md">
        <Button variant="secondary" onClick={() => navigate(`/clients/${client.id}/edit`)}>
          Edit Client
        </Button>

        {isAdmin && (
          <Button
            variant="secondary"
            onClick={() => setShowDelete(true)}
            style={{ marginLeft: "var(--space-sm)" }}
          >
            Delete Client
          </Button>
        )}
      </div>

      <Card title="Client Information">
        <div className={styles.profileGrid}>

          {/* Always show type */}
          <div className={styles.profileField}>
            <span className={styles.label}>Type</span>
            <span><TypeBadge type={client.type} /></span>
          </div>

          {/* INDIVIDUAL FIELDS */}
          {category === "INDIVIDUAL" && (
            <>
              <div className={styles.profileField}>
                <span className={styles.label}>First Name</span>
                <span>{client.firstName || "—"}</span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.label}>Last Name</span>
                <span>{client.lastName || "—"}</span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.label}>ID Number</span>
                <span>{client.idNumber || "—"}</span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.label}>Title</span>
                <span>{client.title || "—"}</span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.label}>Email</span>
                <span>{client.email || "—"}</span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.label}>Phone</span>
                <span>{client.phone || "—"}</span>
              </div>
            </>
          )}

          {/* COMPANY FIELDS */}
          {category === "COMPANY" && (
            <>
              <div className={styles.profileField}>
                <span className={styles.label}>Company Name</span>
                <span>{client.companyName || "—"}</span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.label}>Tax Number</span>
                <span>{client.taxNumber || "—"}</span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.label}>VAT Number</span>
                <span>{client.vatNumber || "—"}</span>
              </div>

              <h3>Contact Person</h3>

              <div className={styles.profileField}>
                <span className={styles.label}>First Name</span>
                <span>{client.contactFirstName || "—"}</span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.label}>Last Name</span>
                <span>{client.contactLastName || "—"}</span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.label}>ID Number</span>
                <span>{client.contactIdNumber || "—"}</span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.label}>Title</span>
                <span>{client.contactTitle || "—"}</span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.label}>Email</span>
                <span>{client.contactEmail || "—"}</span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.label}>Phone</span>
                <span>{client.contactPhone || "—"}</span>
              </div>
            </>
          )}

          {/* Shared fields */}
          <div className={styles.profileField}>
            <span className={styles.label}>Address</span>
            <span>{client.address || "—"}</span>
          </div>

          <div className={styles.profileField}>
            <span className={styles.label}>Created</span>
            <span>{new Date(client.createdAt).toLocaleDateString()}</span>
          </div>

        </div>
      </Card>

      <Card title="Policies">
        <p>Policies integration coming soon…</p>
      </Card>

      <Card title="Claims">
        <p>Claims integration coming soon…</p>
      </Card>

      {showDelete && (
        <ConfirmModal
          title="Delete Client"
          message="Are you sure you want to delete this client?"
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </PageLayout>
  );
}
