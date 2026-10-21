import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import api, { errMsg } from "../../api.js";
import { useAuth } from "../../auth.jsx";
import { StatusBadge, TypeBadge } from "../../components/Badges.jsx";
import ItemCard from "../../components/ItemCard.jsx";
import Icon from "../../components/Icon.jsx";
import { fmtDate } from "../../utils.js";

export default function ItemDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const loc = useLocation();
  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);
  const [proof, setProof] = useState("");
  const [formErr, setFormErr] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () =>
    api
      .get(`/items/${id}`)
      .then((r) => setItem(r.data))
      .catch((e) => setErr(errMsg(e)));
  useEffect(() => {
    setItem(null);
    setErr("");
    setOpen(false);
    load();
  }, [id]);

  if (err)
    return (
      <div className="empty">
        <h2>{err}</h2>
        <Link to="/browse">Back to Browse Items</Link>
      </div>
    );
  if (!item) return <p className="muted">Loading...</p>;

  const own = user && user.id === item.reportedBy;
  const canClaim = item.type === "found" && item.status === "approved" && !own;
  const submitClaim = async (e) => {
    e.preventDefault();
    setFormErr("");
    setBusy(true);
    try {
      await api.post("/claims", { itemId: item.id, proof });
      setOpen(false);
      setProof("");
      await load();
    } catch (x) {
      setFormErr(errMsg(x));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="detail">
        <div className="pic">
          {item.image ? (
            <img src={item.image} alt={item.title} />
          ) : (
            <Icon name="box" size={64} />
          )}
        </div>
        <div>
          <div className="row" style={{ marginBottom: 8 }}>
            <TypeBadge type={item.type} />
            {item.status !== "approved" && <StatusBadge status={item.status} />}
          </div>
          <h1>{item.title}</h1>
          <p className="muted">
            {item.type === "found" ? "Found" : "Lost"} at {item.location} on{" "}
            {fmtDate(item.date)}
          </p>

          {canClaim && !user && (
            <Link className="btn" to="/login" state={{ from: loc.pathname }}>
              Log in to claim this item
            </Link>
          )}
          {canClaim && user && item.myClaim && (
            <div className="alert info">
              Your claim is <b>{item.myClaim.status}</b>. Track it in{" "}
              <Link to="/claims">My Claims</Link>.
            </div>
          )}
          {canClaim && user && !item.myClaim && !open && (
            <button className="btn" onClick={() => setOpen(true)}>
              Claim this item
            </button>
          )}
          {canClaim && user && !item.myClaim && open && (
            <form className="card" onSubmit={submitClaim}>
              <div className="field">
                <label htmlFor="proof">
                  How can you prove this item is yours?
                </label>
                <textarea
                  id="proof"
                  value={proof}
                  onChange={(e) => setProof(e.target.value)}
                  placeholder="Describe unique marks, contents, serial number, when and where you lost it..."
                  required
                />
              </div>
              {formErr && <div className="alert err">{formErr}</div>}
              <div className="row">
                <button className="btn" disabled={busy}>
                  {busy ? "Submitting..." : "Submit claim"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          {item.type === "lost" && item.status === "approved" && !own && (
            <Link className="btn btn-ghost" to={`/report?type=found`}>
              I found this item
            </Link>
          )}
          {item.status === "rejected" && own && (
            <div className="alert err">Rejected: {item.rejectReason}</div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 22 }}>
        <h3>Description</h3>
        <p>{item.description}</p>
        <dl className="kv">
          <dt>Category</dt>
          <dd>{item.category}</dd>
          <dt>Location</dt>
          <dd>{item.location}</dd>
          <dt>Date</dt>
          <dd>{fmtDate(item.date)}</dd>
        </dl>
      </div>

      {item.similar.length > 0 && (
        <>
          <h2 style={{ marginTop: 26 }}>Similar items</h2>
          <div className="grid-cards">
            {item.similar.map((s) => (
              <ItemCard key={s.id} item={s} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
