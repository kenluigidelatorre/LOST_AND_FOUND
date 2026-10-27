import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { StatusBadge } from "../../components/Badges.jsx";
import { fmtDate } from "../../utils.js";

export default function MyClaims() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/claims/mine")
      .then((r) => setRows(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1>My claims</h1>
      <div className="card tbl-wrap" style={{ padding: 0 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Item</th>
              <th>Status</th>
              <th>Date claimed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>
                  <StatusBadge
                    claim
                    status={c.returnedAt ? "returned" : c.status}
                  />
                  {c.adminNote && c.status === "rejected" && (
                    <div className="small muted" style={{ marginTop: 4 }}>
                      Reason: {c.adminNote}
                    </div>
                  )}
                  {c.status === "approved" && !c.returnedAt && (
                    <div className="small muted" style={{ marginTop: 4 }}>
                      Visit the office to pick it up.
                    </div>
                  )}
                </td>
                <td>{fmtDate(c.createdAt)}</td>
                <td>
                  <Link
                    className="btn btn-sm btn-ghost"
                    to={`/items/${c.itemId}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="4" className="empty">
                  {loading ? (
                    "Loading..."
                  ) : (
                    <>
                      No claims yet.{" "}
                      <Link to="/browse">Browse found items</Link> to submit
                      one.
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
