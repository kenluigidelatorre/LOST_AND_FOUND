import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../auth.jsx";
import api from "../api.js";
import Icon from "./Icon.jsx";

const USER_NAV = [
  ["/dashboard", "dashboard", "Dashboard"],
  ["/browse", "search", "Browse Items"],
  ["/report", "plus", "Report Item"],
  ["/reports", "file", "My Reports"],
  ["/claims", "shield", "My Claims"],
  ["/notifications", "bell", "Notifications"],
];
const ADMIN_NAV = [
  ["/admin", "dashboard", "Dashboard"],
  ["/admin/reports", "file", "Item Reports"],
  ["/admin/claims", "shield", "Claims"],
  ["/admin/analytics", "chart", "Reports & Analytics"],
  ["/notifications", "bell", "Notifications"],
];

export const Logo = () => (
  <Link to="/" className="logo">
    <Icon name="box" size={26} /> Lost &amp; Found
  </Link>
);

export function PublicNav() {
  const { user } = useAuth();
  return (
    <header className="topnav">
      <Logo />
      <nav>
        <Link to="/">Home</Link>
        <Link to="/browse">Browse Items</Link>
        <Link to="/report">Report Item</Link>
        <a href="/#how">How It Works</a>
      </nav>
      {user ? (
        <Link
          className="btn"
          to={user.role === "admin" ? "/admin" : "/dashboard"}
        >
          Dashboard
        </Link>
      ) : (
        <Link className="btn" to="/login">
          Login
        </Link>
      )}
    </header>
  );
}

export default function Shell() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user)
      api
        .get("/notifications/unread")
        .then((r) => setUnread(r.data.count))
        .catch(() => {});
  }, [pathname, user]);

  if (!user)
    return (
      <>
        <PublicNav />
        <main className="container">
          <Outlet />
        </main>
      </>
    );

  const adminMode =
    user.role === "admin" &&
    (pathname.startsWith("/admin") || pathname === "/notifications");
  const links = adminMode ? ADMIN_NAV : USER_NAV;
  return (
    <div className="shell">
      <aside className="sidebar">
        <Logo />
        <div className="me">
          <div className="avatar">{user.name[0]}</div>
          <div>
            <strong>{user.name}</strong>
            <div className="muted small">
              {user.role === "admin" ? "Administrator" : "Student"}
            </div>
          </div>
        </div>
        <nav className="nav">
          {links.map(([to, icon, label]) => (
            <NavLink key={to} to={to} end={to === "/admin"}>
              <Icon name={icon} /> {label}
              {to === "/notifications" && unread > 0 && (
                <span className="dot">{unread}</span>
              )}
            </NavLink>
          ))}
          {user.role === "admin" && (
            <Link to={adminMode ? "/dashboard" : "/admin"} className="linkbtn">
              <Icon name="swap" /> {adminMode ? "Student view" : "Admin panel"}
            </Link>
          )}
        </nav>
        <button
          className="linkbtn"
          onClick={() => {
            logout();
            nav("/");
          }}
        >
          <Icon name="logout" /> Logout
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
