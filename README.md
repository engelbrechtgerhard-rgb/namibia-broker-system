# Namibia Independent Broker System (MVP – Alpha)

**Architecture:** AWS Amplify Gen 2 + Serverless + DynamoDB + S3 + Cognito  
**Frontend:** React + TypeScript + Vite  
**Backend:** Lambda microservices + API Gateway + AppSync (GraphQL)

---

## Features

- **Client Management (CRM Lite)** — Add, view, search clients
- **Policy Management** — Create policies, endorsements, renewal tracking
- **Claims Management** — FNOL logging, status updates, event history
- **Reporting** — Dashboard stats, CSV exports
- **Authentication** — Cognito with Admin/Broker roles
- **Document Storage** — S3 presigned URLs for secure uploads
- **Audit Logging** — Track all entity changes
- **Multi-tenant ready** — tenantId on all entities

---

## Project Structure

```
NamibiaBrokerSystem/
├── amplify/
│   ├── auth/resource.ts          # Cognito user pool + groups
│   ├── data/resource.ts          # DynamoDB tables via AppSync
│   ├── storage/resource.ts       # S3 bucket definitions
│   ├── functions/
│   │   ├── crm/                  # Client CRUD
│   │   ├── policy/               # Policy + endorsements
│   │   ├── claims/               # Claims + FNOL
│   │   ├── billing/              # Billing & commission
│   │   ├── documents/            # S3 presigned URLs
│   │   ├── reporting/            # Reports & summaries
│   │   └── renewalReminder/      # Scheduled Lambda
│   └── backend.ts                # Amplify backend definition + API Gateway
├── src/
│   ├── components/
│   │   ├── layout/AppLayout.tsx  # Navigation + layout
│   │   └── ui/                   # Reusable UI components
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── clients/              # ClientList, ClientProfile
│   │   ├── policies/             # PolicyList, PolicyDetail
│   │   ├── claims/               # ClaimList, ClaimDetail
│   │   └── reports/Reports.tsx
│   ├── hooks/                    # useClients, usePolicies, useClaims, useAuth
│   ├── types/index.ts            # TypeScript types
│   ├── lib/apiClient.ts          # API fetch wrapper
│   ├── seed/data.ts              # Sample seed data
│   ├── main.tsx                  # React entry + Amplify config
│   └── App.tsx                   # Router + auth wrapper
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **AWS Account** with CLI configured (`aws configure`)
- **Amplify CLI** (installed via `@aws-amplify/backend-cli`)

---

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Start Amplify sandbox (deploys backend to AWS)
npm run amplify:sandbox

# This will:
# - Deploy Cognito, DynamoDB, S3, Lambda, API Gateway
# - Generate amplify_outputs.json
# - Watch for backend changes

# 3. In a new terminal, start the frontend
npm run dev

# Open http://localhost:3000
```

---

## Deployment

### Development (Sandbox)
```bash
npm run amplify:sandbox
```

### Production
```bash
# Deploy backend + frontend to Amplify Hosting
npm run amplify:deploy

# Or use Amplify Console:
# 1. Connect GitHub repo
# 2. Amplify auto-detects Gen 2 project
# 3. Builds and deploys on every push
```

---

## Authentication

1. On first load, you'll see the Amplify Authenticator
2. **Sign up** with email + password (min 8 chars, 1 uppercase, 1 number)
3. Verify email
4. Sign in

### Assign User to Group (Admin/Broker)
```bash
aws cognito-idp admin-add-user-to-group \
  --user-pool-id <USER_POOL_ID> \
  --username <EMAIL> \
  --group-name Admin
```

### Set Custom Attributes (tenantId, role)
```bash
aws cognito-idp admin-update-user-attributes \
  --user-pool-id <USER_POOL_ID> \
  --username <EMAIL> \
  --user-attributes Name=custom:tenantId,Value=tenant-001 Name=custom:role,Value=Admin
```

---

## API Endpoints

All routes are protected by Cognito authorizer. Include `Authorization: Bearer <idToken>` and `x-tenant-id: <tenantId>` headers.

| Service | Endpoint | Methods |
|---------|----------|---------|
| CRM | `/clients` | GET, POST |
| CRM | `/clients/{id}` | GET, PUT |
| Policy | `/policies` | GET, POST |
| Policy | `/policies/{id}` | GET, PUT |
| Policy | `/policies/{id}/endorse` | POST |
| Claims | `/claims` | GET, POST |
| Claims | `/claims/{id}` | GET, PUT |
| Billing | `/billing` | GET, POST |
| Billing | `/billing/{id}` | PUT |
| Documents | `/documents/upload-url` | POST |
| Documents | `/documents/download-url` | GET |
| Documents | `/documents/list` | GET |
| Reporting | `/reports/summary` | GET |
| Reporting | `/reports/policies` | GET |
| Reporting | `/reports/claims` | GET |

---

## Data Model

### Client
- `clientId` (PK), `tenantId`, `type`, `name`, `email`, `phone`, `idNumber`, `address`, `documents[]`, `createdAt`

### Policy
- `policyId` (PK), `tenantId`, `clientId`, `insurer`, `policyNumber`, `type`, `premium`, `commission`, `status`, `renewalDate`, `inceptionDate`, `documents[]`, `createdAt`

### PolicyVersion
- `versionId` (PK), `policyId`, `tenantId`, `riskItems[]`, `effectiveDate`, `premiumBreakdown`, `endorsementNote`, `createdAt`

### Claim
- `claimId` (PK), `tenantId`, `policyId`, `clientId`, `status`, `description`, `incidentDate`, `documents[]`, `workflowState`, `createdAt`

### ClaimEvent
- `eventId` (PK), `claimId`, `type`, `message`, `user`, `createdAt`

### Billing
- `billingId` (PK), `tenantId`, `policyId`, `premium`, `commission`, `currency`, `vatRate`, `insurer`, `paid`, `createdAt`

### AuditLog
- `logId` (PK), `tenantId`, `entityType`, `entityId`, `action`, `before`, `after`, `user`, `timestamp`

---

## Cost Estimate

**Target:** $20–$40/month for MVP usage (< 1000 users, < 10K requests/month)

| Service | Free Tier | Estimated Cost |
|---------|-----------|----------------|
| Cognito | 50K MAU free | $0 |
| DynamoDB | 25 GB storage, 25 WCU/RCU | $0–$5 |
| Lambda | 1M requests/month free | $0–$2 |
| API Gateway | 1M requests free (12 months) | $0–$3 |
| S3 | 5 GB storage, 20K GET, 2K PUT | $0–$2 |
| Amplify Hosting | 1000 build minutes, 15 GB served | $0–$5 |
| CloudWatch Logs | 5 GB ingestion free | $0–$2 |
| **Total** | | **$0–$19/month** |

---

## Compliance (NAMFISA)

- ✅ Audit logging for all changes
- ✅ Role-based access (Admin, Broker)
- ✅ Secure document storage (S3 private buckets)
- ✅ Multi-tenant architecture
- ✅ Data residency (deploy to `af-south-1` Cape Town region if required)

---

## Next Steps

1. **Seed Data** — Import sample clients/policies via API or DynamoDB console
2. **Email Notifications** — Integrate SES for renewal reminders
3. **Advanced Reporting** — Add QuickSight dashboards
4. **Mobile App** — React Native with same backend
5. **Payment Gateway** — Integrate Peach Payments or PayGate
6. **NAMFISA Reporting** — Export compliance reports

---

## Support

For issues or questions, contact your development team or AWS support.

**Built with ❤️ for Namibian brokers**
