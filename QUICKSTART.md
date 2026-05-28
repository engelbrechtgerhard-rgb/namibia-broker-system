# Quick Start Guide — Namibia Broker System

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Deploy Backend (Amplify Sandbox)

```bash
npm run amplify:sandbox
```

This command will:
- Create AWS resources (Cognito, DynamoDB, Lambda, API Gateway, S3)
- Generate `amplify_outputs.json` with your backend configuration
- Watch for changes and auto-redeploy

**Wait for:** "Deployed successfully" message

## Step 3: Start Frontend

In a **new terminal**:

```bash
npm run dev
```

Open **http://localhost:3000**

## Step 4: Create Your First User

1. Click **"Create Account"**
2. Enter email + password (min 8 chars, 1 uppercase, 1 number)
3. Verify email (check inbox)
4. Sign in

## Step 5: Assign Admin Role

Get your User Pool ID from `amplify_outputs.json` or AWS Console.

```bash
# Add user to Admin group
aws cognito-idp admin-add-user-to-group \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username <YOUR_EMAIL> \
  --group-name Admin

# Set custom attributes
aws cognito-idp admin-update-user-attributes \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username <YOUR_EMAIL> \
  --user-attributes \
    Name=custom:tenantId,Value=tenant-001 \
    Name=custom:role,Value=Admin
```

## Step 6: Test the System

1. **Dashboard** — View summary stats
2. **Clients** — Add a new client
3. **Policies** — Create a policy for that client
4. **Claims** — Log a FNOL (First Notice of Loss)
5. **Reports** — Export CSV

---

## Production Deployment

### Option A: Amplify Console (Recommended)

1. Push code to GitHub
2. Go to **AWS Amplify Console**
3. Click **"New app" → "Host web app"**
4. Connect your GitHub repo
5. Amplify auto-detects Gen 2 project
6. Click **"Save and deploy"**

### Option B: Manual Deploy

```bash
npm run amplify:deploy
```

---

## Troubleshooting

### "amplify_outputs.json not found"
- Run `npm run amplify:sandbox` first
- Wait for deployment to complete

### "User is not authenticated"
- Sign out and sign in again
- Check browser console for errors

### "Access Denied" errors
- Ensure user is in Admin or Broker group
- Check custom attributes are set

### Lambda timeout errors
- Check CloudWatch Logs in AWS Console
- Increase timeout in `resource.ts` files

---

## Environment Variables

Create `.env.local` for local overrides:

```env
VITE_API_ENDPOINT=https://your-api-gateway-url.amazonaws.com/prod
```

---

## Seed Data

Import sample data via API or DynamoDB console. See `src/seed/data.ts` for examples.

---

## Cost Monitoring

Set up AWS Budgets:

```bash
aws budgets create-budget \
  --account-id <YOUR_ACCOUNT_ID> \
  --budget file://budget.json
```

**budget.json:**
```json
{
  "BudgetName": "NamibiaBrokerBudget",
  "BudgetLimit": { "Amount": "40", "Unit": "USD" },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}
```

---

## Support Contacts

- **AWS Support:** https://console.aws.amazon.com/support
- **Amplify Docs:** https://docs.amplify.aws
- **Project Issues:** [GitHub Issues]

---

**Ready to go! 🚀**
