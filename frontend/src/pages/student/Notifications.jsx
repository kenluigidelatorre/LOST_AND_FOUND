import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api.js";
import Icon from "../../components/Icon.jsx";

const COLOR = {
  approved: "#1f9d57",
  returned: "#1f9d57",
  rejected: "#c63d3d",
  claim: "#1E6BB8",
  report: "#1E6BB8",
};

export default function Notifications() {
  const [rows, setRows] = useState([]);
  const nav = useNavigate();
  useEffect(() => {
    api.get("/notifications").then((r) => setRows(r.data));
  }, []);

  const open = async (n) => {
    if (!n.isRead) {
      await api.patch(`/notifications/${n.id}/read`);
      setRows((r) =>
        r.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
      );
    }
    if (n.link) nav(n.link);
  };
  const readAll = async () => {
    await api.patch("/notifications/read-all");
    setRows((r) => r.map((x) => ({ ...x, isRead: true })));
  };

  return (
    <>
      <div className="between">
        <h1>Notifications</h1>
        {rows.some((r) => !r.isRead) && (
          <button className="btn btn-ghost btn-sm" onClick={readAll}>
            Mark all as read
          </button>
        )}
      </div>
      <div className="card" style={{ padding: 0 }}>
        {rows.map((n) => (
          <div
            key={n.id}
            className={`notif ${n.isRead ? "" : "unread"}`}
            onClick={() => open(n)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && open(n)}
          >
            <span
              className="ico"
              style={{ background: COLOR[n.type] || "#1E6BB8" }}
            >
              <Icon name="bell" size={16} />
            </span>
            <div>
              <div>{n.message}</div>
              <div className="muted small">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {!rows.length && <div className="empty">You're all caught up.</div>}
      </div>
    </>
  );
}
