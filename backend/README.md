# GiveHope API

Production backend for the GiveHope NGO trustee and donation platform. Currency is INR; amounts are numbers in rupees (max 2 decimal places). All HTTP routes live under `/api`.

## Setup

1. Install [Node.js 18+](https://nodejs.org/) and create a MongoDB Atlas cluster (a local MongoDB is not required).
2. From this folder:

```bash
npm install
cp .env.example .env
```

3. Fill in `.env` (see below). `MONGODB_URI` and `JWT_SECRET` are required to start the server.
4. Seed demo data, then run the API:

```bash
npm run seed
npm run dev
```

The API listens on `http://localhost:5000/api` by default. Point the Vite frontend at `VITE_API_URL=http://localhost:5000/api`.

| Script | Command |
| --- | --- |
| Development (watch) | `npm run dev` |
| Production | `npm start` |
| Wipe + insert demo data | `npm run seed` |

## Environment variables

| Variable | Example | Required | Notes |
| --- | --- | --- | --- |
| `PORT` | `5000` | no | HTTP port |
| `MONGODB_URI` | Atlas SRV URI | **yes** | MongoDB Atlas connection string |
| `JWT_SECRET` | long random string | **yes** | Used to sign access tokens |
| `JWT_EXPIRES_IN` | `7d` | no | jsonwebtoken expiry |
| `CLIENT_URL` | `http://localhost:5173` | no | Comma-separated CORS origins (include Bolt preview URLs here) |
| `SEED_PASSWORD` | `ChangeMe@123` | seed only | Password for every seeded account |
| `NODE_ENV` | `development` | no | `production` hides stack traces |

## Auth

Send `Authorization: Bearer <token>` on protected routes. The JWT payload contains only the user id; role is loaded from MongoDB on every request.

Roles: `donor`, `trustee`, `admin`. Registration always creates a `donor`.

## Seeded test accounts

Password is the value of `SEED_PASSWORD` (default `ChangeMe@123`).

| Email | Role |
| --- | --- |
| `jane@example.com` | donor |
| `robert@example.com` | donor |
| `amara@example.com` | trustee |
| `marcus@example.com` | trustee |
| `admin@example.com` | admin |

## Response conventions

Success bodies are the raw object or array (no `{ success, data }` wrapper).

Errors:

```json
{ "message": "Human readable text", "errors": [{ "field": "x", "message": "y" }] }
```

`errors` is present only for validation failures.

| Status | Meaning |
| --- | --- |
| 200 | OK |
| 201 | Created |
| 400 | Validation |
| 401 | Missing/invalid token or bad login |
| 403 | Wrong role / not owner |
| 404 | Not found (including malformed ObjectIds) |
| 409 | Conflict |
| 429 | Rate limited |
| 500 | Server error |

Dates the frontend treats as calendar days (`joinedDate`, `deadline`, `donation.date`, `contactMessage.date`) are `YYYY-MM-DD` strings.

## Endpoints

| Method | Path | Access | Request body / query | Response |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | public | — | `{ "status": "ok" }` |
| POST | `/api/auth/register` | public (rate limited) | `{ name, email, password }` | `201 { token, user }` |
| POST | `/api/auth/login` | public (rate limited) | `{ email, password }` | `{ token, user }` |
| GET | `/api/auth/me` | auth | — | `user` |
| GET | `/api/campaigns` | public | query: `status`, `category`, `search`, `trusteeId` | `campaign[]` |
| GET | `/api/campaigns/mine` | trustee, admin | — | `campaign[]` |
| GET | `/api/campaigns/:id` | public | — | `campaign` |
| POST | `/api/campaigns` | trustee, admin | `{ title, shortDescription?, description?, category, image?, goal, deadline, status?, trusteeId? }` (`trusteeId` required for admin) | `201 campaign` |
| PUT | `/api/campaigns/:id` | trustee (own), admin | partial campaign fields (cannot change `raised`) | `campaign` |
| DELETE | `/api/campaigns/:id` | trustee (own), admin | — | `{ success: true }` or `409` if donations exist |
| POST | `/api/donations` | auth | `{ campaignId, amount }` | `201 donation` |
| GET | `/api/donations/my` | auth | — | `donation[]` |
| GET | `/api/donations` | trustee, admin | query: `campaignId?` | `donation[]` |
| GET | `/api/donations/:id` | owner, trustee, admin | — | `donation` |
| GET | `/api/trustees` | public | — | `trustee[]` |
| GET | `/api/trustees/:id` | public | — | `trustee` |
| POST | `/api/trustees` | admin | `{ name, role, bio?, image?, userId? }` | `201 trustee` |
| PUT | `/api/trustees/:id` | admin | partial trustee fields | `trustee` |
| DELETE | `/api/trustees/:id` | admin | — | `{ success: true }` or `409` if campaigns exist |
| GET | `/api/users` | admin | — | `user[]` |
| GET | `/api/users/:id` | admin or self | — | `user` |
| PATCH | `/api/users/:id/role` | admin | `{ role }` | `user` |
| POST | `/api/contact` | public (rate limited) | `{ name, email, message }` | `201 contactMessage` |
| GET | `/api/contact` | trustee, admin | — | `contactMessage[]` |
| GET | `/api/stats` | trustee, admin | — | `{ totalRaised, totalDonations, donorCount, activeCampaigns, totalCampaigns, monthly }` |

### Shapes

**user:** `{ id, name, email, role, joinedDate, totalDonated }`

**campaign:** `{ id, title, shortDescription, description, category, image, goal, raised, status, deadline, trusteeId, trustee: { id, name, role, image } }`

**donation:** `{ id, userId, campaignId, campaignTitle, amount, date, status, receiptNumber, donorName, createdAt }`

**trustee:** `{ id, name, role, bio, image, userId }`

**contactMessage:** `{ id, name, email, message, date }`

## curl examples

Replace `TOKEN` after login.

```bash
# Register
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Priya Shah","email":"priya@example.com","password":"ChangeMe@123"}'

# Login
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"amara@example.com","password":"ChangeMe@123"}'

# Create campaign (trustee or admin token)
curl -s -X POST http://localhost:5000/api/campaigns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Winter Blankets","shortDescription":"Warmth for displaced families.","description":"Fund blankets and insulated kits.","category":"Emergency","image":"https://images.pexels.com/photos/2699324/pexels-photo-2699324.jpeg","goal":250000,"deadline":"2027-12-31","status":"active"}'

# Donate (any authenticated user)
curl -s -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"campaignId":"CAMPAIGN_ID","amount":2500}'
```
