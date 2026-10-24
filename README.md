# 💚 GiveHope NGO — Verified Trustee Fundraising & Transparent Donations

A modern, responsive NGO fundraising platform designed to connect people with meaningful campaigns through a transparent donation inquiry workflow.

<p align="center">
  <a href="https://ngo-trustee-donate-web-app.netlify.app/">
    <img src="https://img.shields.io/badge/🚀_LIVE_DEMO-Visit_GiveHope-00C7B7?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4-000000?style=flat&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Authentication-JWT-black?style=flat&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

<p align="center">
  <a href="https://ngo-trustee-donate-web-app.netlify.app/">🌐 Live Website</a> •
  <a href="https://github.com/gurpreet110/NGO-Trustee-Donation-web-App">💻 GitHub Repository</a> •
  <a href="https://ngo-trustee-donation-web-app.onrender.com">⚙️ Backend API</a>
</p>

---

## 📌 Overview

**GiveHope NGO** is a full-stack web application built to simplify NGO campaign discovery and donation inquiries. It provides visitors with a user-friendly way to explore campaigns and express their intent to donate, while authorized trustees can manage inquiries through a dedicated dashboard.

The project combines a responsive React interface with a Node.js and Express backend, MongoDB persistence, and JWT-based authentication.

### 🎯 Key Objectives

- Make NGO campaigns easier to discover.
- Simplify the donation inquiry process.
- Provide trustees with a centralized inquiry management dashboard.
- Implement secure authentication and role-based authorization.
- Improve accessibility with theme switching and text-to-speech functionality.

---

## ✨ Features

### 🏠 Campaign Discovery
- Browse NGO campaigns and explore categories.
- View campaign information through a clean interface.
- Navigate between pages using client-side routing.

### 💚 Donation Inquiry System
- Submit donation inquiries or pledges.
- Store inquiry information through the backend API.
- Track inquiries through a structured status workflow.

### 🔐 Authentication & Authorization
- JWT-based authentication.
- Password hashing using bcrypt.
- Protected backend routes.
- Role-based access for trustee functionality.

### 📊 Trustee Dashboard
- Manage incoming donation inquiries.
- Update inquiry statuses: `new`, `contacted`, and `closed`.
- Keep follow-up activities organized.

### 🌙 Dark & Light Mode
- Switch between light and dark themes.
- Persist the selected preference using `localStorage`.
- Use the `givehope-theme` key for theme persistence.
- Initialize the theme early to help prevent unwanted flashes.

### 🔊 Read Aloud Accessibility
- Text-to-speech using the browser's Web Speech API.
- Play, pause, resume, and stop controls.
- Prioritize selected text where appropriate.
- Clean up speech activity during route changes.

### 📱 Responsive UI
- Responsive layouts for desktop and mobile.
- Reusable React components.
- Lucide React icons.
- Semantic markup and reduced-motion considerations.

### 🛡️ Backend Security
- Helmet security headers.
- Rate limiting.
- MongoDB query sanitization middleware.
- Zod request validation.
- JWT verification and password hashing.

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend UI |
| Vite 7 | Development server and build tooling |
| React Router DOM 7 | Client-side routing |
| Tailwind CSS 3.4 | Styling and responsive design |
| Lucide React | Icons |
| Node.js | Backend runtime |
| Express.js 4 | REST API |
| MongoDB Atlas | Database |
| Mongoose 8 | Database modeling |
| JWT | Authentication |
| bcrypt | Password hashing |
| Helmet | HTTP security headers |
| Zod | Request validation |
| Node.js Test Runner | Backend testing |
| Netlify | Frontend deployment |
| Render | Backend deployment |

---

## 🏗️ Project Architecture

```text
NGO-Trustee-Donation-web-App/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── seed/
│   └── server.js
│
└── README.md
```

*Folder names are illustrative; keep them aligned with the actual repository.*

### 🔄 Application Workflow

1. Visitors open the React frontend.
2. The frontend sends API requests to the Express backend.
3. The backend validates requests and applies authentication or authorization where required.
4. Mongoose communicates with MongoDB to read or store application data.
5. The backend returns a response, and the frontend updates the interface.

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account or a local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/gurpreet110/NGO-Trustee-Donation-web-App.git
cd NGO-Trustee-Donation-web-App
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Add any other environment variables required by your implementation.

Start the backend using the script defined in `backend/package.json`, for example:

```bash
npm run dev
```

### 3. Set Up the Frontend

Open a separate terminal:

```bash
cd frontend
npm install
```

If your frontend API configuration uses `VITE_API_URL`, create a frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Use the environment variable name expected by your actual code.

Start the frontend:

```bash
npm run dev
```

Open the local development URL displayed in the terminal.

---

## 🌐 Deployment

### Frontend — Netlify

**Live URL:** https://ngo-trustee-donate-web-app.netlify.app/

1. Connect your GitHub repository to Netlify.
2. Configure the frontend base directory.
3. Set the build command to `npm run build`.
4. Set the publish directory to `dist` for a standard Vite build.
5. Add the production backend URL using the environment variable expected by the frontend.
6. Deploy and verify the live application.

### Backend — Render

**API URL:** https://ngo-trustee-donation-web-app.onrender.com

1. Connect the repository to Render.
2. Configure the backend root directory and start command.
3. Add the required environment variables.
4. Configure MongoDB Atlas access.
5. Allow the deployed frontend origin in the backend's CORS configuration.
6. Deploy and test the API endpoints.

> Deployment commands and environment variable names should match the actual project configuration.

---

## 🧪 Testing

The backend uses Node.js's native test runner.

If a test script is defined in `backend/package.json`, run:

```bash
npm test
```

The project has previously been described as having 12 backend tests. Run the suite to verify the current test count and results.

---

## 🔒 Security Practices

- Store credentials and secrets in environment variables.
- Never expose the JWT secret in frontend code.
- Validate user input on the backend.
- Enforce authorization on trustee-only endpoints.
- Configure CORS for trusted frontend origins.
- Avoid exposing sensitive database fields in API responses.
- Use HTTPS in production.

---

## 🚀 Future Enhancements

- Secure payment gateway integration.
- Verified NGO and trustee onboarding.
- Campaign progress and donation reporting.
- Email notifications for donation inquiries.
- Advanced dashboard filtering and pagination.
- Expanded automated testing and API documentation.

---

## 👨‍💻 Author

**Gurpreet Singh**

- GitHub: [@gurpreet110](https://github.com/gurpreet110)
- Project Repository: [GiveHope NGO — GitHub](https://github.com/gurpreet110/NGO-Trustee-Donation-web-App)
- Live Demo: [GiveHope NGO](https://ngo-trustee-donate-web-app.netlify.app/)

---

<p align="center">
  <strong>💚 GiveHope — Making campaign discovery and donation inquiries simpler and more accessible.</strong>
</p>
