import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api.js";
import ItemCard from "../../components/ItemCard.jsx";
import { CATEGORIES } from "../../utils.js";

export default function Browse() {
  const [sp, setSp] = useSearchParams();
  const [data, setData] = useState({ items: [], pages: 1, total: 0 });
  const [locations, setLocations] = useState([]);
  const [q, setQ] = useState(sp.get("q") || "");
  const [loading, setLoading] = useState(true);

  const set = (k, v) => {
    const n = new URLSearchParams(sp);
    v ? n.set(k, v) : n.delete(k);
    if (k !== "page") n.delete("page");
    setSp(n);
  };
  useEffect(() => {
    api
      .get("/items/locations")
      .then((r) => setLocations(r.data))
      .catch(() => {});
  }, []);
  useEffect(() => {
    setLoading(true);
    api
      .get("/items", { params: Object.fromEntries(sp) })
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [sp]);

  const page = Number(sp.get("page") || 1);
  const sel = (k, label, opts) => (
    <select
      aria-label={label}
      value={sp.get(k) || ""}
      onChange={(e) => set(k, e.target.value)}
    >
      <option value="">{label}</option>
      {opts.map((o) => (
        <option key={o.v ?? o} value={o.v ?? o}>
          {o.t ?? o}
        </option>
      ))}
    </select>
  );

  return (
    <>
      <h1>Browse items</h1>
      <form
        className="filters"
        onSubmit={(e) => {
          e.preventDefault();
          set("q", q.trim());
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for items..."
          aria-label="Search"
        />
        {sel("category", "All categories", CATEGORIES)}
        {sel("type", "All types", [
          { v: "lost", t: "Lost" },
          { v: "found", t: "Found" },
        ])}
        {sel("days", "Any date", [
          { v: 7, t: "Last 7 days" },
          { v: 30, t: "Last 30 days" },
          { v: 90, t: "Last 90 days" },
        ])}
        {sel("location", "All locations", locations)}
      </form>
      {loading ? (
        <p className="muted">Loading...</p>
      ) : data.items.length ? (
        <div className="grid-cards">
          {data.items.map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
        </div>
      ) : (
        <div className="empty">
          No items match your search. Try different filters or report the item.
        </div>
      )}
      {data.pages > 1 && (
        <div className="pager">
          {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`btn btn-sm ${n === page ? "" : "btn-ghost"}`}
              onClick={() => set("page", n)}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
