import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../../auth.jsx";
import ItemCard from "../../components/ItemCard.jsx";
import Icon from "../../components/Icon.jsx";
import { greeting } from "../../utils.js";

export default function Dashboard() {
  const { user } = useAuth();
  const [d, setD] = useState({ recent: [], mine: [], claims: [] });
  useEffect(() => {
    Promise.all([
      api.get("/items/recent"),
      api.get("/items/mine"),
      api.get("/claims/mine"),
    ])
      .then(([a, b, c]) =>
        setD({ recent: a.data, mine: b.data, claims: c.data }),
      )
      .catch(() => {});
  }, []);
  const pending = d.mine.filter((i) => i.status === "pending").length;
  const openClaims = d.claims.filter((c) => c.status === "pending").length;

  return (
    <>
      <h1>
        {greeting()}, {user.name.split(" ")[0]}!
      </h1>
      <p className="muted">Here's what's happening with your items.</p>
      <div className="two">
        <Link to="/report?type=lost" className="card action-card">
          <span className="ico">
            <Icon name="search" size={22} />
          </span>
          <div>
            <strong>Report Lost Item</strong>
            <div className="muted small">Tell us what you lost</div>
          </div>
        </Link>
        <Link to="/report?type=found" className="card action-card">
          <span className="ico" style={{ background: "#1f9d57" }}>
            <Icon name="plus" size={22} />
          </span>
          <div>
            <strong>Report Found Item</strong>
            <div className="muted small">Help someone get their item back</div>
          </div>
        </Link>
      </div>
      <div className="stats">
        <div className="card stat">
          <b>{d.mine.length}</b>
          <span>My reports</span>
        </div>
        <div className="card stat">
          <b>{pending}</b>
          <span>Waiting for review</span>
        </div>
        <div className="card stat">
          <b>{openClaims}</b>
          <span>Open claims</span>
        </div>
      </div>
      <div className="between">
        <h2>Recent items</h2>
        <Link to="/browse">View all</Link>
      </div>
      {d.recent.length ? (
        <div className="grid-cards">
          {d.recent.map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
        </div>
      ) : (
        <p className="muted">Nothing published yet.</p>
      )}
    </>
  );
}
