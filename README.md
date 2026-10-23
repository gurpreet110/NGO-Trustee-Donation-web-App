# GiveHope — NGO Trustee & Donation Platform

A full-stack web application concept for presenting NGO fundraising campaigns, tracking donations, and organizing trustee and administrator workflows. The repository contains a React frontend and a REST API built with Node.js, Express, and MongoDB.

> **Project status: Under development.** The backend API is implemented in the source tree, but the frontend's current API modules still read and write in-memory mock data. The UI and API are therefore **not yet fully integrated**. Donation processing on the backend is simulated; this project does not currently process real payments.

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Repository structure](#repository-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Demo data](#demo-data)
- [API overview](#api-overview)
- [Roles and access](#roles-and-access)
- [Important implementation notes](#important-implementation-notes)
- [Next steps](#next-steps)

## Features

### Frontend

- Public home, about, campaigns, campaign details, trustees, and contact pages.
- Campaign browsing and category filtering.
- Registration and login screens, plus route guards for authenticated and role-specific screens.
- Donation modal, donation history, and printable donation receipt UI.
- Trustee dashboard and campaign-management screens.
- Admin panel for user-role management.
- Contact form and contact-message inbox UI.
- Reusable React components, toast notifications, loading/error states, and responsive styling.

### Backend API

- User registration and login with password hashing and JWT access tokens.
- Role-based authorization for donors, trustees, and admins.
- Campaign CRUD with trustee ownership checks and campaign-goal status handling.
- Donation records, receipt numbering, and campaign/user donation totals.
- Trustee profile management and user-role administration.
- Contact-message submission and protected inbox retrieval.
- Dashboard statistics, request validation, rate limiting, security headers, CORS configuration, and centralized error handling.

## Technology stack

| Area | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router, Tailwind CSS, Axios, Lucide React |
| Backend | Node.js (18+), Express 4, ES modules |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing |
| Validation and security | Zod, Helmet, `express-mongo-sanitize`, `express-rate-limit`, CORS |
| Development tools | npm, ESLint, Git |

## Repository structure

```text
NGO-Web-App/
├── frontend/
│   ├── src/
│   │   ├── api/              # Current mock-data API modules and Axios client
│   │   ├── components/       # Shared UI, campaign, donation, and dashboard components
│   │   ├── context/          # Authentication context
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Public, donor, trustee, and admin screens
│   │   ├── routes/           # Route definitions and route guards
│   │   └── utils/            # Formatting, constants, and receipt helpers
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── src/
    │   ├── config/            # Environment and MongoDB configuration
    │   ├── controllers/       # Request handlers
    │   ├── middleware/        # Authentication, authorization, validation, errors, rate limits
    │   ├── models/            # Mongoose schemas
    │   ├── routes/             # REST API routes
    │   ├── seed/               # Demo-data seeding script
    │   ├── services/            # Payment simulation, receipts, statistics, trustee profiles
    │   ├── utils/               # Shared helpers
    │   ├── app.js
    │   └── server.js
    └── package.json
```

## Getting started

### Prerequisites

- Node.js 18 or later and npm.
- A MongoDB database, such as a MongoDB Atlas cluster.
- Git (if cloning the repository).

### 1. Get the code

```bash
git clone https://github.com/gurpreet110/NGO-Trustee-Donation-web-App.git
cd NGO-Trustee-Donation-web-App
```

### 2. Configure and start the backend

```bash
cd backend
npm install
```

Create a local file named `backend/.env` with the variables listed in [Environment variables](#environment-variables). Use your own MongoDB connection string and a long, random JWT secret. Do not copy real credentials into source control.

Start the API:

```bash
npm run dev
```

The API defaults to `http://localhost:5000/api`. A basic health check is available at `http://localhost:5000/api/health` and should return:

```json
{ "status": "ok" }
```

Other backend scripts:

```bash
npm start      # Start without watch mode
npm run seed   # DESTRUCTIVE: clears existing application collections, then inserts demo data
```

**Important:** Only run `npm run seed` against a disposable development database. The seed script deletes existing users, trustees, campaigns, donations, contact messages, and receipt counters before inserting demo records.

### 3. Configure and start the frontend

In a separate terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` with:

```dotenv
VITE_API_URL=http://localhost:5000/api
# Optional for future payment-gateway work; Razorpay is not currently integrated.
VITE_RAZORPAY_KEY_ID=
```

Run the development server:

```bash
npm run dev
```

Vite prints the local URL, typically `http://localhost:5173`.

Available frontend scripts:

```bash
npm run dev      # Start Vite development server
npm run build    # Build the frontend for production
npm run preview  # Preview a production build locally
npm run lint     # Run ESLint
```

## Environment variables

### Backend — `backend/.env`

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | HTTP port; defaults to `5000`. |
| `MONGODB_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs. Use a strong random value. |
| `JWT_EXPIRES_IN` | No | Token expiry accepted by `jsonwebtoken`; defaults to `7d`. |
| `CLIENT_URL` | No | Allowed frontend origin(s), comma-separated; defaults to `http://localhost:5173`. |
| `SEED_PASSWORD` | No | Password assigned to all demo accounts by the seed script. Set a private value before seeding. |
| `NODE_ENV` | No | Set to `production` to suppress detailed server errors in responses. |

Generate a JWT secret locally with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend — `frontend/.env`

| Variable | Required for current mock UI | Description |
|---|---|---|
| `VITE_API_URL` | No | Intended Axios API base URL, e.g. `http://localhost:5000/api`. Current feature API modules do not yet call the backend. |
| `VITE_RAZORPAY_KEY_ID` | No | Placeholder for possible future payment integration; it is not currently used by the frontend source. |

Variables prefixed with `VITE_` are exposed to client-side code. Never put private keys, database credentials, or payment secrets in frontend environment variables.

## Demo data

The backend seed script creates demo donor, trustee, and admin accounts and sample campaigns/donations. The password for all seeded accounts is the value of `SEED_PASSWORD` at seed time (the script's fallback is `ChangeMe@123`). Change this to a private development-only password before seeding, and never use demo credentials in production.

The frontend also contains its own mock users, campaigns, donations, trustee records, contact messages, and plaintext demo passwords in `frontend/src/api/mockData.js`. These records are in-memory sample data, not persistent database records.

## API overview

All endpoints are prefixed with `/api`. Protected endpoints require an access token in the header:

```http
Authorization: Bearer <token>
```

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Health check |
| POST | `/auth/register` | Public | Register a donor account |
| POST | `/auth/login` | Public | Authenticate and return a token/user |
| GET | `/auth/me` | Authenticated | Return the current user |
| GET | `/campaigns` | Public | List campaigns; supports status, category, search, and trustee filters |
| GET | `/campaigns/:id` | Public | Get campaign details |
| GET | `/campaigns/mine` | Trustee, admin | List campaigns managed by the current trustee (or all for admin) |
| POST | `/campaigns` | Trustee, admin | Create a campaign |
| PUT | `/campaigns/:id` | Owning trustee, admin | Update a campaign |
| DELETE | `/campaigns/:id` | Owning trustee, admin | Delete a campaign if it has no donations |
| POST | `/donations` | Authenticated | Create a donation record using the simulated payment service |
| GET | `/donations/my` | Authenticated | List the current user's donations |
| GET | `/donations` | Trustee, admin | List donations, optionally filtered by campaign |
| GET | `/donations/:id` | Owner, trustee, admin | Get a donation record |
| GET | `/trustees` | Public | List trustees |
| GET | `/trustees/:id` | Public | Get trustee details |
| POST | `/trustees` | Admin | Create a trustee profile |
| PUT | `/trustees/:id` | Admin | Update a trustee profile |
| DELETE | `/trustees/:id` | Admin | Delete a trustee without campaigns |
| GET | `/users` | Admin | List users |
| GET | `/users/:id` | Self, admin | Get a user record |
| PATCH | `/users/:id/role` | Admin | Change a user's role |
| POST | `/contact` | Public, rate limited | Submit a contact message |
| GET | `/contact` | Trustee, admin | List contact messages |
| GET | `/stats` | Trustee, admin | Retrieve fundraising and campaign statistics |

Successful responses generally return the resource or array directly. Errors use a JSON body with a human-readable `message`; validation failures may also include an `errors` array.

### Example: register a donor

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Priya Shah","email":"priya@example.com","password":"UseADevelopmentPassword123"}'
```

### Example: list campaigns

```bash
curl http://localhost:5000/api/campaigns
```

## Roles and access

- **Donor:** Can register/login, browse campaigns, create simulated donations, and view their own donation history.
- **Trustee:** Can manage their own campaigns and access trustee-level donation/statistics/contact views.
- **Admin:** Can manage campaigns and trustee profiles, list users, change roles, and access administrative views.

New public registrations are always assigned the `donor` role. Role checks are enforced in backend middleware as well as represented by frontend route guards; frontend guards alone are not a security boundary.

## Important implementation notes

1. **Frontend/backend integration is pending.** `frontend/src/api/authApi.js`, `campaignApi.js`, `donationApi.js`, `trusteeApi.js`, `userApi.js`, and `contactApi.js` currently import and mutate arrays from `mockData.js`. `frontend/src/api/axios.js` defines an Axios client, but those feature modules do not use it yet. Logging in or donating in the current UI therefore does not authenticate against or persist data to the backend.
2. **Payments are simulated.** `backend/src/services/paymentService.js` generates a simulated transaction ID and marks the donation completed. Razorpay order creation, signature verification, webhook handling, refunds, and live payment confirmation are not implemented. Do not treat a simulated donation as a real financial transaction or tax receipt.
3. **Receipt UI vs API receipts.** The backend generates receipt numbers for donation records. The current frontend receipt helper generates a printable receipt number from the mock donation ID, so the two flows are not yet aligned.
4. **Demo seeding is destructive.** `npm run seed` clears the application's collections before inserting fixtures. Use a disposable database only.
5. **No automated test suite is included** in the current source tree. Run and manually verify the frontend and backend locally before relying on the workflows.
6. **Environment files must stay private.** Keep `.env` files out of Git. If a real credential has ever been committed or shared outside a trusted local environment, rotate it and issue a replacement.

## Next steps

- Replace mock frontend API modules with Axios calls matching the backend routes and response shapes.
- Update `AuthContext` to store the JWT, send it with protected requests, and restore/validate sessions with `/auth/me`.
- Align frontend IDs and trustee ownership with MongoDB ObjectIds returned by the API.
- Integrate a payment provider in test mode with server-side payment verification before recording a donation as completed.
- Align printable receipts with the backend-generated receipt number and transaction status.
- Add API/frontend tests, document deployment configuration, and deploy the frontend and API.

## Author

**Gurpreet Singh** — [GitHub](https://github.com/gurpreet110)
