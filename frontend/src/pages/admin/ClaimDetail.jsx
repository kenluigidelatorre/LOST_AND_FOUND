import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { errMsg } from "../../api.js";
import { StatusBadge } from "../../components/Badges.jsx";
import Icon from "../../components/Icon.jsx";
import { fmtDate } from "../../utils.js";

export default function ClaimDetail() {
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = () =>
    api
      .get(`/claims/${id}`)
      .then((r) => setC(r.data))
      .catch((e) => setMsg({ err: errMsg(e) }));
  useEffect(() => {
    load();
  }, [id]);

  const act = async (fn) => {
    setMsg(null);
    setBusy(true);
    try {
      await fn();
      await load();
      setMsg({ ok: "Saved." });
    } catch (x) {
      setMsg({ err: errMsg(x) });
    } finally {
      setBusy(false);
    }
  };
  if (!c)
    return msg?.err ? (
      <div className="alert err">{msg.err}</div>
    ) : (
      <p className="muted">Loading...</p>
    );

  return (
    <>
      <Link to="/admin/claims">Back to claims</Link>
      <div className="between" style={{ marginTop: 8 }}>
        <h1>Claim details</h1>
        <StatusBadge claim status={c.returnedAt ? "returned" : c.status} />
      </div>
      {msg?.err && <div className="alert err">{msg.err}</div>}
      {msg?.ok && <div className="alert ok">{msg.ok}</div>}
      <div className="two">
        <div className="card">
          <div className="pic" style={{ marginBottom: 12 }}>
            {c.image ? (
              <img src={c.image} alt={c.title} />
            ) : (
              <Icon name="box" size={48} />
            )}
          </div>
          <h3>{c.title}</h3>
          <p className="muted">{c.itemDescription}</p>
          <dl className="kv">
            <dt>Found at</dt>
            <dd>{c.location}</dd>
            <dt>Date</dt>
            <dd>{fmtDate(c.itemDate)}</dd>
            <dt>Item status</dt>
            <dd>{c.itemStatus}</dd>
          </dl>
        </div>
        <div className="card">
          <h3>Claimant</h3>
          <dl className="kv">
            <dt>Name</dt>
            <dd>{c.claimantName}</dd>
            <dt>Student ID</dt>
            <dd>{c.claimantStudentId}</dd>
            <dt>Email</dt>
            <dd>{c.claimantEmail}</dd>
            <dt>Claimed on</dt>
            <dd>{fmtDate(c.createdAt)}</dd>
          </dl>
          <h3 style={{ marginTop: 16 }}>Proof of ownership</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{c.proof}</p>
        </div>
      </div>
      <div className="card">
        {c.status === "pending" && (
          <>
            <div className="field">
              <label htmlFor="note">Admin note (required to reject)</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="row">
              <button
                className="btn btn-ok"
                disabled={busy}
                onClick={() =>
                  act(() =>
                    api.patch(`/claims/${id}/decision`, {
                      decision: "approved",
                      note,
                    }),
                  )
                }
              >
                Approve claim
              </button>
              <button
                className="btn btn-bad"
                disabled={busy}
                onClick={() =>
                  act(() =>
                    api.patch(`/claims/${id}/decision`, {
                      decision: "rejected",
                      note,
                    }),
                  )
                }
              >
                Reject claim
              </button>
            </div>
          </>
        )}
        {c.status === "approved" && !c.returnedAt && (
          <div className="between">
            <span>
              Claim approved. Record the return once the owner has picked up the
              item.
            </span>
            <button
              className="btn"
              disabled={busy}
              onClick={() => act(() => api.post(`/claims/${id}/return`))}
            >
              Record return
            </button>
          </div>
        )}
        {c.returnedAt && (
          <span>
            Item returned to {c.claimantName} on {fmtDate(c.returnedAt)}.
          </span>
        )}
        {c.status === "rejected" && (
          <span>Rejected. Reason: {c.adminNote}</span>
        )}
      </div>
    </>
  );
}
