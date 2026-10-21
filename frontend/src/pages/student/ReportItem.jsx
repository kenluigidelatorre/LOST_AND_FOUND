import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api, { errMsg } from "../../api.js";
import { CATEGORIES } from "../../utils.js";

const empty = {
  title: "",
  category: "",
  description: "",
  location: "",
  date: "",
};

export default function ReportItem() {
  const [sp] = useSearchParams();
  const [type, setType] = useState(
    sp.get("type") === "found" ? "found" : "lost",
  );
  const [f, setF] = useState(empty);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const pick = (e) => {
    const x = e.target.files[0];
    if (!x) return;
    if (!/^image\/(jpeg|png)$/.test(x.type))
      return setMsg({ err: "Only JPG or PNG images are allowed." });
    if (x.size > 2 * 1024 * 1024)
      return setMsg({ err: "Image must be 2 MB or smaller." });
    setMsg(null);
    setFile(x);
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    const fd = new FormData();
    Object.entries({ ...f, type }).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("image", file); // field name must match multer's upload.single('image')
    try {
      await api.post("/items", fd);
      setMsg({
        ok: "Report submitted. An admin will review it before it is published.",
      });
      setF(empty);
      setFile(null);
    } catch (x) {
      setMsg({ err: errMsg(x) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1>Report item</h1>
      <p className="muted">
        Help us find what you lost or return what you found.
      </p>
      <div className="tabs">
        <button
          type="button"
          className={type === "lost" ? "on" : ""}
          onClick={() => setType("lost")}
        >
          Lost item
        </button>
        <button
          type="button"
          className={type === "found" ? "on" : ""}
          onClick={() => setType("found")}
        >
          Found item
        </button>
      </div>
      <div className="split">
        <form className="card" onSubmit={submit}>
          {msg?.ok && <div className="alert ok">{msg.ok}</div>}
          {msg?.err && <div className="alert err">{msg.err}</div>}
          <div className="field">
            <label htmlFor="t">Item name</label>
            <input
              id="t"
              value={f.title}
              onChange={set("title")}
              placeholder="e.g. Black backpack"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="c">Category</label>
            <select
              id="c"
              value={f.category}
              onChange={set("category")}
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="d">Description</label>
            <textarea
              id="d"
              value={f.description}
              onChange={set("description")}
              placeholder="Color, brand, size, unique marks..."
              required
            />
          </div>
          <div className="field">
            <label htmlFor="l">Location where you {type} it</label>
            <input
              id="l"
              value={f.location}
              onChange={set("location")}
              placeholder="e.g. Library"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="dt">Date {type}</label>
            <input
              id="dt"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={f.date}
              onChange={set("date")}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="img">Photo (optional, JPG or PNG up to 2 MB)</label>
            <label className="drop" htmlFor="img">
              {file ? (
                <img src={URL.createObjectURL(file)} alt="Preview" />
              ) : (
                "Click to choose a photo"
              )}
            </label>
            <input
              id="img"
              type="file"
              accept="image/jpeg,image/png"
              onChange={pick}
              style={{ display: "none" }}
            />
          </div>
          <button className="btn" disabled={busy}>
            {busy ? "Submitting..." : "Submit report"}
          </button>
        </form>
        <aside className="card" style={{ alignSelf: "start" }}>
          <h3>Accepted categories</h3>
          <ul className="muted" style={{ paddingLeft: 18, margin: 0 }}>
            {CATEGORIES.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
