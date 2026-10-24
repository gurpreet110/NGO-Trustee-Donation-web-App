# GiveHope NGO — Verified Trustee Fundraising & Transparent Donations

[![Live Demo](https://ngo-trustee-donate-web-app.netlify.app/)
[![API Status](https://img.shields.io/badge/API%20Status-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://ngo-trustee-donation-web-app.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gurpreet110/NGO-Trustee-Donation-web-App)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%207-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

---

## 🌐 Live Production Deployment

- **Frontend Application:** [https://ngo-trustee-app.netlify.app/](https://ngo-trustee-app.netlify.app/)
- **Backend REST API:** [https://ngo-trustee-donation-web-app.onrender.com](https://ngo-trustee-donation-web-app.onrender.com)
- **Source Code Repository:** [https://github.com/gurpreet110/NGO-Trustee-Donation-web-App](https://github.com/gurpreet110/NGO-Trustee-Donation-web-App)

---

## 💡 Why This Project?

Non-Governmental Organizations (NGOs) perform critical humanitarian work—from supplying clean drinking water in arid regions to funding children's education and delivering disaster relief. However, trust and accessibility are often the two greatest bottlenecks in modern philanthropy:
1. Donors often hesitate because they cannot verify where their funds go or who is overseeing the ground operations.
2. Digital accessibility barriers prevent elderly or visually impaired benefactors from easily engaging with impact reports and campaign updates.

**GiveHope** was built to solve these fundamental challenges by combining **trustee-vetted campaign verification**, an **accessible native Web Speech Read Aloud feature**, **instant Dark/Light mode**, and a **transparent Donation Inquiry & Coordination workflow**.

---

## 🎯 Problem Statement

Traditional fundraising platforms and non-profit portals often suffer from:
- **Lack of Transparency & Accountability:** Donors do not know who verifies each cause or how milestones are monitored.
- **Accessibility Barriers:** Many NGO sites are cluttered with small text, low-contrast palettes, and zero screen reader/voice assist capabilities for users with visual fatigue or impairments.
- **Complex Donation Friction:** Users are often forced through complicated registration funnels just to inquire about a major contribution or pledge recurring support.
- **Fragmented Trustee Workflows:** Trustees frequently lack an intuitive dashboard to review prospective donors, track campaign metrics, and coordinate follow-ups.

---

## 🌟 Key Use Cases

### 1. Generous Donors & Public Visitors
- **Explore Verified Causes:** Browse ongoing initiatives across categories (Water, Education, Emergency Relief, Healthcare).
- **Listen with One Click (Read Aloud):** Enable native text-to-speech to listen to campaign stories without reading long paragraphs.
- **Submit Donation Inquiries & Pledges:** Choose specific donation interests (One-time, Monthly, Corporate Partnership) and pledge support through a structured form.
- **Theme Switcher:** Seamlessly switch between crisp Light Mode and eye-friendly Dark Mode with persistent preferences.

### 2. Board of Trustees & Field Coordinators
- **Campaign Verification & Oversight:** Review campaign progress, deadlines, and real-time funding statistics.
- **Donation Inquiries Dashboard:** Access dedicated trustee screens to view incoming donor inquiries, filter by status (`new`, `contacted`, `closed`), and search by donor or campaign.
- **Accountability & Integrity:** Ensure incoming pledges are triaged securely without directly tampering with verified raised amounts.

### 3. NGO Administrators
- **Role-Based Access Control:** Secure JWT authentication protecting trustee and administrative views.
- **Auditable Records:** Centralized MongoDB database for users, campaigns, and inquiries with strict Zod validation and rate limiting.

---

## 🚀 Key Features Highlights

### 🌓 1. Complete Dark Mode & Light Mode
- Accessible theme switcher in the Navbar with animated Sun and Moon icons.
- **Zero-Flicker Persistence:** Inline theme loader script in `<head>` ensures zero white flashes on page reload or route changes.
- Persistent user preference stored in `localStorage` (`givehope-theme`), automatically syncing with system OS color scheme on initial visit.
- Strict WCAG contrast compliance across all cards, modals, tables, badges, and form controls.

### 🔊 2. Native Website Read Aloud (Web Speech API)
- Built using the browser's native `window.speechSynthesis` and `SpeechSynthesisUtterance` API—zero external paid API dependencies or third-party tracking.
- Features **Play, Pause, Resume, and Stop** controls with live soundwave equalizer animation.
- **Smart Semantic Extraction:** Automatically skips navigation links, footers, buttons, and private form inputs to read only meaningful headings, descriptions, and impact metrics.
- Prioritizes user-selected text if highlighted.
- Automatic route cleanup prevents overlapping voices when navigating across pages.

### 📋 3. Donation Inquiry & Pledge Flow
- Structured multi-field inquiry form capturing Donor Type (Individual, Corporate, Foundation), Occupation, Income Bracket, Intended Amount, and Personal Message.
- Real-time client-side validation paired with backend Zod schemas.
- Trustee coordination view with search and quick status switcher (`new` ➔ `contacted` ➔ `closed`).

### ⚡ 4. Premium UI & Micro-interactions
- Responsive modern design built with Tailwind CSS.
- Smooth slide-up modals, subtle card hover scale animations, and animated progress bars.
- `prefers-reduced-motion` CSS overrides for users sensitive to motion.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite 7, React Router DOM 7 |
| **Styling & Icons** | Tailwind CSS 3.4, Lucide React Icons |
| **Accessibility & Audio** | Native HTML5 Web Speech API (`speechSynthesis`), ARIA Roles |
| **Backend API** | Node.js (v18+ / v24), Express.js 4 (ES Modules) |
| **Database** | MongoDB Atlas with Mongoose 8 ODM |
| **Authentication & Security** | JSON Web Tokens (JWT), Bcrypt.js, Helmet, Express Mongo Sanitize, Rate Limiters |
| **Validation** | Zod (Schema Validation on all endpoints) |
| **Testing** | Node.js Native Test Runner (`node --test`), 12 Automated Unit & Integration Tests |
| **Hosting & CI/CD** | **Netlify** (Frontend with SPA redirects) & **Render** (Backend Web Service) |

---

## 📁 Project Folder Structure

```text
NGO-Web-App/
├── .gitignore                      # Protected secrets & build artifacts
├── netlify.toml                    # Netlify SPA build & redirect configuration
├── README.md                       # Master project documentation
│
├── backend/                        # Express.js REST API
│   ├── .env.example                # Example environment variables template
│   ├── package.json                # Dependencies & test scripts
│   ├── tests/                      # Automated unit & integration tests
│   │   ├── donationInquiryFlow.test.js
│   │   └── validation.test.js
│   └── src/
│       ├── server.js               # Server entry point
│       ├── app.js                  # Express app, CORS, security & health check
│       ├── config/
│       │   ├── db.js               # MongoDB connection with DNS fallback
│       │   └── env.js              # Environment variable parsing
│       ├── controllers/            # Route controllers
│       │   ├── authController.js
│       │   ├── campaignController.js
│       │   ├── donationInquiryController.js
│       │   └── trusteeController.js
│       ├── middleware/             # Rate limiters, Zod validation, error handlers
│       ├── models/                 # Mongoose schemas (Campaign, User, DonationInquiry)
│       ├── routes/                 # REST endpoints (/api/campaigns, /api/donation-inquiries)
│       └── seed/                   # Database seeding script
│
└── frontend/                       # React 18 + Vite SPA
    ├── index.html                  # HTML5 entry with early theme flash prevention script
    ├── package.json                # Dependencies & build scripts
    ├── tailwind.config.js          # Tailwind CSS with class-based darkMode
    ├── public/
    │   └── _redirects              # Netlify client-side SPA routing fallback
    └── src/
        ├── App.jsx                 # Theme, Auth, Toast providers & layout
        ├── index.css               # Design system, keyframes, soundwave & scrollbars
        ├── main.jsx                # React DOM mount point
        ├── api/                    # Axios clients & resilient fallbacks
        │   ├── axios.js            # Auto-normalizing API client (handles /api suffix)
        │   ├── campaignApi.js
        │   ├── donationInquiryApi.js
        │   ├── trusteeApi.js
        │   └── mockData.js         # Offline fallback data
        ├── components/             # Reusable UI components
        │   ├── campaign/           # CampaignCard, ProgressBar
        │   ├── common/             # Navbar, Footer, Button, Modal, Toast, ReadAloudWidget
        │   └── donation/           # DonateModal
        ├── context/                # ThemeContext & AuthContext
        ├── hooks/                  # useTheme, useAuth, useDocumentTitle
        ├── pages/                  # Application views
        │   ├── Home.jsx            # Hero, stats counters, featured campaigns
        │   ├── About.jsx           # Mission, Vision, and Values
        │   ├── Campaigns.jsx       # Grid with category filters & search
        │   ├── CampaignDetail.jsx  # Detailed cause story & sidebar
        │   ├── Donate.jsx          # Public donation inquiry & pledge form
        │   ├── DonationInquiries.jsx # Trustee dashboard for review
        │   ├── Trustees.jsx        # Board of trustees profiles
        │   ├── Contact.jsx         # Contact inquiry form
        │   ├── Login.jsx           # Donor / Trustee authentication
        │   └── Register.jsx        # Account registration
        └── routes/                 # AppRoutes & protected route guards
```

---

## 🛠️ Step-by-Step Setup & Local Installation

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (Version 18.x or 20.x+)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/) database cluster or local MongoDB instance

---

### 1. Clone the Repository
```bash
git clone https://github.com/gurpreet110/NGO-Trustee-Donation-web-App.git
cd NGO-Trustee-Donation-web-App
```

---

### 2. Configure & Run Backend Server

1. Open the backend folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   SEED_PASSWORD=ChangeMe@123
   ```

3. Seed initial campaigns and trustee demo accounts into your database:
   ```bash
   npm run seed
   ```

4. Run automated test suite to verify backend health:
   ```bash
   npm test
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API will start listening at `http://localhost:5000/api`.*

---

### 3. Configure & Run Frontend Application

1. Open a new terminal window, navigate to `frontend/`, and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

2. Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will launch at `http://localhost:5173`.*

---

## 🚢 Deployment Guide

### Deploy Backend (Render.com)
1. Link your GitHub repository on [Render](https://render.com/).
2. Select **Web Service** with:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=*`.

### Deploy Frontend (Netlify)
1. Link your GitHub repository on [Netlify](https://app.netlify.com/).
2. Specify build parameters:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Set Environment Variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`

---

## 👨‍💻 Author & Contact

**Gurpreet Singh**
- **GitHub:** [@gurpreet110](https://github.com/gurpreet110)
- **Email:** [gurpreetsingh75009@gmail.com](mailto:gurpreetsingh75009@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Contributions, issues, and feature requests are welcome!
