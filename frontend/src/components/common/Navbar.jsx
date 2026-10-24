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
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
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
  const { isDark, toggleTheme } = useTheme();
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
        ? "text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 font-semibold"
        : "text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800/60",
    ].join(" ");

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/30">
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

          {/* Desktop auth actions & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Switcher Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 transition-transform hover:-rotate-12" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Hi, <span className="font-semibold text-gray-700 dark:text-gray-200">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-lg transition-all shadow-sm shadow-teal-700/20"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions: Theme toggle & Drawer Hamburger */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <button
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {publicLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={linkClass}
                end={l.to === "/"}
                onClick={() => setMobileOpen(false)}
              >
                <span className="block px-3 py-2">{l.label}</span>
              </NavLink>
            ))}
            {roleLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={linkClass}
                onClick={() => setMobileOpen(false)}
              >
                <span className="flex items-center gap-2 px-3 py-2">
                  {l.icon && <l.icon className="w-4 h-4" />}
                  {l.label}
                </span>
              </NavLink>
            ))}

            <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Interface Theme
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-gray-600" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>

              {isAuthenticated ? (
                <>
                  <p className="px-3 text-sm text-gray-500 dark:text-gray-400">
                    Signed in as <span className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</span>
                  </p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg w-full transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-3">
                  <Link
                    to="/login"
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-700 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-lg shadow-sm"
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
