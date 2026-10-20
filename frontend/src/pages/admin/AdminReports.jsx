import { useEffect, useState } from "react";
import api, { errMsg } from "../../api.js";
import { StatusBadge, TypeBadge } from "../../components/Badges.jsx";
import Icon from "../../components/Icon.jsx";
import { fmtDate } from "../../utils.js";

function ReviewModal({ item, onClose, onDone }) {
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const decide = async (decision) => {
    setErr("");
    setBusy(true);
    try {
      await api.patch(`/items/${item.id}/review`, { decision, reason });
      onDone();
    } catch (x) {
      setErr(errMsg(x));
      setBusy(false);
    }
  };
  return (
    <div className="modal-bg" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="between">
          <h2>{item.title}</h2>
          <TypeBadge type={item.type} />
        </div>
        <div className="pic" style={{ marginBottom: 14 }}>
          {item.image ? (
            <img src={item.image} alt={item.title} />
          ) : (
            <Icon name="box" size={48} />
          )}
        </div>
        <p>{item.description}</p>
        <dl className="kv">
          <dt>Category</dt>
          <dd>{item.category}</dd>
          <dt>Location</dt>
          <dd>{item.location}</dd>
          <dt>Date</dt>
          <dd>{fmtDate(item.date)}</dd>
          <dt>Reported by</dt>
          <dd>
            {item.reporterName} ({item.reporterStudentId})
          </dd>
          <dt>Status</dt>
          <dd>
            <StatusBadge status={item.status} />
          </dd>
        </dl>
        {err && (
          <div className="alert err" style={{ marginTop: 12 }}>
            {err}
          </div>
        )}
        {item.status === "pending" ? (
          <>
            <div className="field" style={{ marginTop: 14 }}>
              <label htmlFor="rr">Rejection reason (required to reject)</label>
              <textarea
                id="rr"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="row">
              <button
                className="btn btn-ok"
                disabled={busy}
                onClick={() => decide("approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-bad"
                disabled={busy}
                onClick={() => decide("rejected")}
              >
                Reject
              </button>
              <button className="btn btn-ghost" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        ) : (
          <button
            className="btn btn-ghost"
            style={{ marginTop: 14 }}
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminReports() {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ status: "", type: "", q: "" });
  const [sel, setSel] = useState(null);
  const load = () =>
    api.get("/items/admin/all", { params: f }).then((r) => setRows(r.data));
  useEffect(() => {
    load();
  }, [f]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <>
      <h1>Item reports</h1>
      <div className="filters" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
        <input
          placeholder="Search by item or student..."
          value={f.q}
          onChange={set("q")}
          aria-label="Search"
        />
        <select value={f.status} onChange={set("status")} aria-label="Status">
          <option value="">All statuses</option>
          {["pending", "approved", "rejected", "claimed", "returned"].map(
            (s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ),
          )}
        </select>
        <select value={f.type} onChange={set("type")} aria-label="Type">
          <option value="">All types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </div>
      <div className="card tbl-wrap" style={{ padding: 0 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Type</th>
              <th>Submitted by</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>R-{String(r.id).padStart(3, "0")}</td>
                <td>{r.title}</td>
                <td>
                  <TypeBadge type={r.type} />
                </td>
                <td>{r.reporterName}</td>
                <td>{fmtDate(r.createdAt)}</td>
                <td>
                  <StatusBadge status={r.status} />
                </td>
                <td>
                  <button className="btn btn-sm" onClick={() => setSel(r)}>
                    {r.status === "pending" ? "Review" : "View"}
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="7" className="empty">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {sel && (
        <ReviewModal
          item={sel}
          onClose={() => setSel(null)}
          onDone={() => {
            setSel(null);
            load();
          }}
        />
      )}
    </>
  );
}
