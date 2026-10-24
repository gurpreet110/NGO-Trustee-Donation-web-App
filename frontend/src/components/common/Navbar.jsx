import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Heart,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Receipt,
  FolderOpen,
  Inbox,
  HeartHandshake,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/utils";

// Links shown to all visitors (not logged in).
const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/campaigns", label: "Campaigns" },
  { to: "/donate", label: "Donate" },
  { to: "/trustees", label: "Trustees" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Role-specific links appended after public links.
  const roleLinks = [];
  if (isAuthenticated) {
    roleLinks.push({ to: "/my-donations", label: "My Donations", icon: Receipt });
  }
  if (role === ROLES.TRUSTEE || role === ROLES.ADMIN) {
    roleLinks.push({
      to: "/trustee-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    });
    roleLinks.push({
      to: "/manage-campaigns",
      label: "Manage Campaigns",
      icon: FolderOpen,
    });
    roleLinks.push({
      to: "/contact-messages",
      label: "Messages",
      icon: Inbox,
    });
    roleLinks.push({
      to: "/donation-inquiries",
      label: "Inquiries",
      icon: HeartHandshake,
    });
  }
  if (role === ROLES.ADMIN) {
    roleLinks.push({ to: "/manage-trustees", label: "Manage Trustees", icon: Users });
    roleLinks.push({ to: "/admin", label: "Admin Panel", icon: ShieldCheck });
  }

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    [
      "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
      isActive
        ? "text-teal-700 bg-teal-50"
        : "text-gray-600 hover:text-teal-700 hover:bg-gray-50",
    ].join(" ");

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-600 text-white">
              <Heart className="w-5 h-5" />
            </span>
            <span className="hidden sm:inline">GiveHope</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {publicLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"}>
                {l.label}
              </NavLink>
            ))}
            {roleLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop auth actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-500">
                  Hi, <span className="font-semibold text-gray-700">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {publicLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={linkClass}
                end={l.to === "/"}
                onClick={() => setMobileOpen(false)}
              >
                <span className="block px-3 py-2.5">{l.label}</span>
              </NavLink>
            ))}
            {roleLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={linkClass}
                onClick={() => setMobileOpen(false)}
              >
                <span className="flex items-center gap-2 px-3 py-2.5">
                  {l.icon && <l.icon className="w-4 h-4" />}
                  {l.label}
                </span>
              </NavLink>
            ))}
            <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
              {isAuthenticated ? (
                <>
                  <p className="px-3 text-sm text-gray-500">
                    Signed in as <span className="font-semibold">{user.name}</span>
                  </p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-3">
                  <Link
                    to="/login"
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-teal-700 border border-teal-200 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
