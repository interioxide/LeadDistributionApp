# Lead Distribution Platform

A full-stack lead distribution app — one public lead form, one distribution, many brokers.
Leads are captured with IP address, deduplicated by email, and assigned to eligible brokers
using a percentage-based deficit algorithm (timezone, working hours, and daily cap aware).

- **Frontend**: [Next.js](https://nextjs.org/) (`web/`)
- **Backend**: [NestJS](https://nestjs.com/) - Express (`api/`)
- **Database**: MySQL, accessed via Prisma

---

## Prerequisites

Install the following before setting up the project:

- [**Docker**](https://docs.docker.com/get-docker/)
- [**Node.js** v20 or later recaommended](https://nodejs.org/en/download)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/interioxide/LeadDistributionApp.git
cd LeadDistributionApp
```

### 2. Environment variables

Copy the example env files and fill in real values:

```bash
cp api/.env.example api/.env
cp web/.env.example web/.env
```

Then open `api/.env` and `web/.env` and set the actual values (database connection string,
JWT secret, API URL, etc.) — see each file's comments for what's expected. Never commit the
real `.env` files, only `.env.example`.

### 3. Install dependencies

Run inside **both** the `api` and `web` folders:

```bash
cd api
npm install

cd ../web
npm install
```

### 4. Database setup and migrations (Optional: For local setup only)

From the **project root**, start MySQL via Docker:

```bash
docker compose up -d
```

Then, from the **`api` folder**, generate the Prisma client and apply migrations which includes DB seeds:

```bash
cd api
npx prisma generate
npx prisma migrate deploy
```

This creates all required tables (`users`, `brokers`, `forms`, `distributions`,
`distribution_brokers`, `leads`) and applies the schema in `api/prisma/schema.prisma`.

---

## Running the app

### Development

```bash
# Terminal 1 — backend
cd api
npm run start:dev

# Terminal 2 — frontend
cd web
npm run dev
```
Open browser using the URL: http://localhost:8305

### Production (VPS, via PM2)

```bash
# Backend
cd api
npm run build

# Frontend
cd ../web
npm run build

cd ../
pm2 start ecosystem.config.js
```

To restart after a deploy or config change:

```bash
pm2 restart lead-distribution-api
pm2 restart lead-distribution-web
```

To check logs:

```bash
pm2 logs lead-distribution-api
pm2 logs lead-distribution-web
```

To confirm both processes are running:

```bash
pm2 status
```

---

## Accessing the app

- **Admin login**: `http://<vps-ip-or-domain>:<assigned-frontend-port>/login`.

- **Public lead form**: `http://<vps-ip-or-domain>:<assigned-frontend-port>/<form-slug>`
  (e.g. `/lead-registration`, once the form is created from the admin dashboard)

The backend runs on its own port internally and is not publicly exposed — the frontend talks
to it using the `API_URL` value set in `web/.env`.

---

## Test notes

Suggested checks after deployment (mirrors the exam's suggested test cases):

- [ ] Login works with the seeded admin credentials
- [ ] Create/edit brokers with all required fields (timezone, hours, working days, daily cap)
- [ ] Create the one lead form, confirm a second form cannot be created
- [ ] Try creating a distribution before a form exists, confirm the
      "Oops, please create a form first." message appears
- [ ] Create the one distribution, confirm a second cannot be created
- [ ] Submit a lead from the public form URL, confirm IP address is captured and saved
- [ ] Confirm the lead is assigned to an eligible broker (or marked `unsent` if none are eligible)
- [ ] Submit the same email again, confirm it's marked `duplicate`
- [ ] Confirm a broker outside working hours / at daily cap is skipped during assignment
- [ ] Manually assign an unsent lead to a broker from the Leads page
- [ ] Restart the app via PM2 and confirm it comes back up correctly

---

## Notes

- Do not commit real `.env` files, secrets, or VPS credentials, only `.env.example` files
  with placeholder values are tracked in git.
- Only one lead form and one distribution can ever exist, by design (see validation rules
  in the exam spec).