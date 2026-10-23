import { Routes, Route } from "react-router-dom";
import { ROLES } from "@/utils";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Campaigns from "@/pages/Campaigns";
import CampaignDetail from "@/pages/CampaignDetail";
import Trustees from "@/pages/Trustees";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import MyDonations from "@/pages/MyDonations";
import TrusteeDashboard from "@/pages/TrusteeDashboard";
import AdminPanel from "@/pages/AdminPanel";
import ManageCampaigns from "@/pages/ManageCampaigns";
import ContactMessages from "@/pages/ContactMessages";
import NotFound from "@/pages/NotFound";

// Route guards
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/campaigns" element={<Campaigns />} />
      <Route path="/campaigns/:id" element={<CampaignDetail />} />
      <Route path="/trustees" element={<Trustees />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated routes */}
      <Route
        path="/my-donations"
        element={
          <ProtectedRoute>
            <MyDonations />
          </ProtectedRoute>
        }
      />

      {/* Trustee + Admin routes */}
      <Route
        path="/trustee-dashboard"
        element={
          <RoleRoute allowedRoles={[ROLES.TRUSTEE, ROLES.ADMIN]}>
            <TrusteeDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/manage-campaigns"
        element={
          <RoleRoute allowedRoles={[ROLES.TRUSTEE, ROLES.ADMIN]}>
            <ManageCampaigns />
          </RoleRoute>
        }
      />
      <Route
        path="/contact-messages"
        element={
          <RoleRoute allowedRoles={[ROLES.TRUSTEE, ROLES.ADMIN]}>
            <ContactMessages />
          </RoleRoute>
        }
      />

      {/* Admin-only routes */}
      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminPanel />
          </RoleRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
