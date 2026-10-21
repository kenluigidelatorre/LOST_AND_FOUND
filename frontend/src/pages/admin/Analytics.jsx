import { useEffect, useState } from "react";
import api from "../../api.js";
import { Bars, LineChart } from "../../components/Charts.jsx";

export default function Analytics() {
  const [range, setRange] = useState({ from: "", to: "" });
  const [s, setS] = useState(null);
  useEffect(() => {
    api.get("/admin/stats", { params: range }).then((r) => setS(r.data));
  }, [range]);

  const exportCsv = () => {
    const csv = [
      "date,lost,found",
      ...s.trend.map((d) => `${d.label},${d.lost},${d.found}`),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "report-trend.csv";
    a.click();
  };
  if (!s) return <p className="muted">Loading...</p>;
  const t = s.totals;

  return (
    <>
      <div className="between">
        <h1>Reports &amp; analytics</h1>
        <div className="row">
          <input
            type="date"
            aria-label="From"
            value={range.from}
            onChange={(e) => setRange({ ...range, from: e.target.value })}
            style={{ width: "auto" }}
          />
          <input
            type="date"
            aria-label="To"
            value={range.to}
            onChange={(e) => setRange({ ...range, to: e.target.value })}
            style={{ width: "auto" }}
          />
          <button className="btn btn-ghost" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>
      <p className="muted">
        {range.from || range.to
          ? "Showing the selected date range."
          : "Counts cover all time. The trend shows the last 30 days."}
      </p>
      <div className="stats">
        {[
          ["Total reports", t.total],
          ["Lost items", t.lost],
          ["Found items", t.found],
          ["Return rate", t.returnRate + "%"],
        ].map(([l, v]) => (
          <div className="card stat" key={l}>
            <b>{v}</b>
            <span>{l}</span>
          </div>
        ))}
      </div>
      <div className="split">
        <div className="card">
          <h3>Report trend</h3>
          <LineChart data={s.trend} />
          <div className="small muted">
            <span style={{ color: "#FF6B6B" }}>Lost</span> &nbsp;{" "}
            <span style={{ color: "#3BA9FF" }}>Found</span>
          </div>
        </div>
        <div className="card">
          <h3>Top categories</h3>
          <Bars data={s.categories} />
        </div>
      </div>
    </>
  );
}
