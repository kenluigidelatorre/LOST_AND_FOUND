export function Donut({ lost, found }) {
  const total = lost + found || 1,
    r = 52,
    c = 2 * Math.PI * r;
  return (
    <svg
      viewBox="0 0 140 140"
      width="170"
      role="img"
      aria-label={`${lost} lost, ${found} found`}
    >
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="#3BA9FF"
        strokeWidth="16"
      />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="#FF6B6B"
        strokeWidth="16"
        strokeDasharray={`${(c * lost) / total} ${c}`}
        transform="rotate(-90 70 70)"
      />
      <text
        x="70"
        y="70"
        textAnchor="middle"
        fill="#E8F1FA"
        fontSize="28"
        fontWeight="800"
      >
        {lost + found}
      </text>
      <text x="70" y="88" textAnchor="middle" fill="#A9C4DE" fontSize="10">
        Total reports
      </text>
    </svg>
  );
}

export function LineChart({ data }) {
  const W = 560,
    H = 190,
    P = 28;
  const max = Math.max(1, ...data.flatMap((d) => [d.lost, d.found]));
  const x = (i) => P + (i * (W - 2 * P)) / Math.max(data.length - 1, 1);
  const pts = (k) =>
    data
      .map((d, i) => `${x(i)},${H - P - (d[k] / max) * (H - 2 * P)}`)
      .join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="chart"
      role="img"
      aria-label="Report trend"
    >
      <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="#1F4670" />
      <line x1={P} y1={P} x2={P} y2={H - P} stroke="#1F4670" />
      <text x="4" y={P + 4} fill="#A9C4DE" fontSize="11">
        {max}
      </text>
      <text x="4" y={H - P} fill="#A9C4DE" fontSize="11">
        0
      </text>
      <polyline
        points={pts("found")}
        fill="none"
        stroke="#3BA9FF"
        strokeWidth="2.5"
      />
      <polyline
        points={pts("lost")}
        fill="none"
        stroke="#FF6B6B"
        strokeWidth="2.5"
      />
      {data.length > 0 && (
        <text x={P} y={H - 8} fill="#A9C4DE" fontSize="11">
          {data[0].label}
        </text>
      )}
      {data.length > 1 && (
        <text x={W - P} y={H - 8} fill="#A9C4DE" fontSize="11" textAnchor="end">
          {data[data.length - 1].label}
        </text>
      )}
    </svg>
  );
}

export function Bars({ data }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  if (!data.length) return <p className="muted">No data in this range.</p>;
  return data.map((d) => (
    <div className="bar" key={d.category}>
      <span>{d.category}</span>
      <i style={{ width: `${(d.count / max) * 100}%` }} />
      <b>{d.count}</b>
    </div>
  ));
}
