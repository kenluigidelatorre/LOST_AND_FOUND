import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { StatusBadge } from "../../components/Badges.jsx";
import { fmtDate } from "../../utils.js";

export default function AdminClaims() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("pending");
  useEffect(() => {
    api.get("/claims", { params: { status } }).then((r) => setRows(r.data));
  }, [status]);

  return (
    <>
      <h1>Claims</h1>
      <div className="tabs">
        {[
          ["pending", "Pending"],
          ["approved", "Approved"],
          ["rejected", "Rejected"],
          ["", "All"],
        ].map(([v, l]) => (
          <button
            key={l}
            className={status === v ? "on" : ""}
            onClick={() => setStatus(v)}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="card tbl-wrap" style={{ padding: 0 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Item</th>
              <th>Claimant</th>
              <th>Date claimed</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>
                  {c.claimantName}
                  <div className="muted small">{c.claimantStudentId}</div>
                </td>
                <td>{fmtDate(c.createdAt)}</td>
                <td>
                  <StatusBadge
                    claim
                    status={c.returnedAt ? "returned" : c.status}
                  />
                </td>
                <td>
                  <Link className="btn btn-sm" to={`/admin/claims/${c.id}`}>
                    {c.status === "pending" ? "Verify" : "View"}
                  </Link>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="5" className="empty">
                  No claims here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
