import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { StatusBadge } from "../../components/Badges.jsx";
import { fmtDate } from "../../utils.js";

export default function MyReports() {
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("lost");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/items/mine")
      .then((r) => setRows(r.data))
      .finally(() => setLoading(false));
  }, []);
  const list = rows.filter((r) => r.type === tab);

  return (
    <>
      <h1>My reports</h1>
      <div className="tabs">
        <button
          className={tab === "lost" ? "on" : ""}
          onClick={() => setTab("lost")}
        >
          Lost items
        </button>
        <button
          className={tab === "found" ? "on" : ""}
          onClick={() => setTab("found")}
        >
          Found items
        </button>
      </div>
      <div className="card tbl-wrap" style={{ padding: 0 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Item</th>
              <th>Status</th>
              <th>Date reported</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>
                  <StatusBadge status={r.status} />
                  {r.status === "rejected" && (
                    <div className="small muted" style={{ marginTop: 4 }}>
                      Reason: {r.rejectReason}
                    </div>
                  )}
                </td>
                <td>{fmtDate(r.createdAt)}</td>
                <td>
                  <Link className="btn btn-sm btn-ghost" to={`/items/${r.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan="4" className="empty">
                  {loading
                    ? "Loading..."
                    : `You haven't reported any ${tab} items yet.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
