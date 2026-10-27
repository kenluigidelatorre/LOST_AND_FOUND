import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { Donut } from "../../components/Charts.jsx";
import { StatusBadge, TypeBadge } from "../../components/Badges.jsx";
import { fmtDate } from "../../utils.js";

export default function AdminDashboard() {
  const [s, setS] = useState(null);
  useEffect(() => {
    api.get("/admin/stats").then((r) => setS(r.data));
  }, []);
  if (!s) return <p className="muted">Loading...</p>;
  const t = s.totals;
  const tiles = [
    ["Total reports", t.total],
    ["Pending reports", t.pending],
    ["Published items", t.published],
    ["Pending claims", s.pendingClaims],
    ["Returned items", t.returned],
  ];

  return (
    <>
      <h1>Admin dashboard</h1>
      <div className="stats">
        {tiles.map(([l, v]) => (
          <div className="card stat" key={l}>
            <b>{v}</b>
            <span>{l}</span>
          </div>
        ))}
      </div>
      <div className="split">
        <div className="card">
          <div className="between">
            <h3>Recent submissions</h3>
            <Link to="/admin/reports">Manage</Link>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <tbody>
                {s.recentItems.map((i) => (
                  <tr key={i.id}>
                    <td>{i.title}</td>
                    <td>
                      <TypeBadge type={i.type} />
                    </td>
                    <td>
                      <StatusBadge status={i.status} />
                    </td>
                    <td className="muted small">{fmtDate(i.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3>Lost vs found</h3>
          <Donut lost={t.lost} found={t.found} />
          <div className="small muted">
            <span style={{ color: "#FF6B6B" }}>Lost {t.lost}</span> &nbsp;{" "}
            <span style={{ color: "#3BA9FF" }}>Found {t.found}</span>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="between">
          <h3>Claims waiting for review</h3>
          <Link to="/admin/claims">All claims</Link>
        </div>
        {s.waitingClaims.length ? (
          s.waitingClaims.map((c) => (
            <div
              className="between"
              key={c.id}
              style={{ padding: "8px 0", borderTop: "1px solid var(--line)" }}
            >
              <span>
                <b>{c.title}</b>{" "}
                <span className="muted small">by {c.claimantName}</span>
              </span>
              <Link className="btn btn-sm" to={`/admin/claims/${c.id}`}>
                Review
              </Link>
            </div>
          ))
        ) : (
          <p className="muted">No claims are waiting.</p>
        )}
      </div>
    </>
  );
}
