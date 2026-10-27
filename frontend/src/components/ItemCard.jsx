import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import { TypeBadge } from "./Badges.jsx";
import { fmtDate } from "../utils.js";

export default function ItemCard({ item }) {
  return (
    <Link to={`/items/${item.id}`} className="card icard">
      <div className="thumb">
        {item.image ? (
          <img src={item.image} alt={item.title} />
        ) : (
          <Icon name="box" size={40} />
        )}
        <TypeBadge type={item.type} />
      </div>
      <div className="icard-body">
        <strong>{item.title}</strong>
        <span className="muted small">{item.location}</span>
        <span className="muted small">{fmtDate(item.date)}</span>
      </div>
    </Link>
  );
}
