import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api.js";
import { PublicNav } from "../../components/Shell.jsx";
import ItemCard from "../../components/ItemCard.jsx";
import Icon from "../../components/Icon.jsx";

export default function Home() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    api
      .get("/items/recent")
      .then((r) => setItems(r.data))
      .catch(() => {});
  }, []);

  return (
    <>
      <PublicNav />
      <section className="hero">
        <div className="container">
          <h1>
            Lost Something?
            <br />
            <span>We Can Help.</span>
          </h1>
          <p>
            Report, search, and claim lost and found items all in one place.
          </p>
          <form
            className="searchbar"
            onSubmit={(e) => {
              e.preventDefault();
              nav(`/browse?q=${encodeURIComponent(q)}`);
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for items (e.g. backpack, phone, ID...)"
              aria-label="Search items"
            />
            <button className="btn" aria-label="Search">
              <Icon name="search" />
            </button>
          </form>
          <div className="row">
            <Link className="btn" to="/report?type=lost">
              Report Lost Item
            </Link>
            <Link className="btn btn-ghost" to="/report?type=found">
              Report Found Item
            </Link>
          </div>
        </div>
      </section>
      <section className="container">
        <div className="between">
          <h2>Recently Added Items</h2>
          <Link to="/browse">View all</Link>
        </div>
        {items.length ? (
          <div className="grid-cards">
            {items.map((i) => (
              <ItemCard key={i.id} item={i} />
            ))}
          </div>
        ) : (
          <p className="muted">No published items yet.</p>
        )}
      </section>
      <section className="container how" id="how">
        {[
          ["Report", "Submit a lost or found item with a photo."],
          [
            "Claim",
            "Request an item and describe how you can prove it is yours.",
          ],
          ["Get notified", "Track the status of your reports and claims."],
        ].map(([t, d]) => (
          <div className="card" key={t}>
            <h3>{t}</h3>
            <p className="muted" style={{ margin: 0 }}>
              {d}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}
