import { Link } from "react-router-dom";
import { Logo } from "./Shell.jsx";

export default function AuthCard({ title, sub, children, foot }) {
  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Logo />
        </div>
        <h2 style={{ textAlign: "center" }}>{title}</h2>
        <p className="muted" style={{ textAlign: "center", marginTop: 0 }}>
          {sub}
        </p>
        {children}
        <p
          className="muted small"
          style={{ textAlign: "center", marginBottom: 0 }}
        >
          {foot}
        </p>
        <p style={{ textAlign: "center", marginBottom: 0 }}>
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
