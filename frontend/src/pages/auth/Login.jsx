import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth.jsx';
import { errMsg } from '../../api.js';
import AuthCard from '../../components/AuthCard.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ identifier: '', password: '' });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const u = await login(f.identifier, f.password);
      nav(loc.state?.from || (u.role === 'admin' ? '/admin' : '/dashboard'), { replace: true });
    } catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };

  return (
    <AuthCard title="Welcome back" sub="Log in to your account" foot={<>Don't have an account? <Link to="/register">Register</Link></>}>
      {err && <div className="alert err">{err}</div>}
      <form onSubmit={submit}>
        <div className="field"><label htmlFor="id">Email or student ID</label>
          <input id="id" value={f.identifier} onChange={(e) => setF({ ...f, identifier: e.target.value })} required autoFocus /></div>
        <div className="field"><label htmlFor="pw">Password</label>
          <input id="pw" type={show ? 'text' : 'password'} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required /></div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 400 }}>
          <input type="checkbox" style={{ width: 'auto' }} checked={show} onChange={(e) => setShow(e.target.checked)} /> Show password
        </label>
        <button className="btn" style={{ width: '100%', margin: '14px 0' }} disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
      </form>
    </AuthCard>
  );
}
