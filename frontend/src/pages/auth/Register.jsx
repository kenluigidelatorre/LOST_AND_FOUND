import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth.jsx';
import { errMsg } from '../../api.js';
import AuthCard from '../../components/AuthCard.jsx';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', studentId: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await register(f); nav('/dashboard', { replace: true }); }
    catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };

  return (
    <AuthCard title="Create your account" sub="Use your school details" foot={<>Already registered? <Link to="/login">Log in</Link></>}>
      {err && <div className="alert err">{err}</div>}
      <form onSubmit={submit}>
        <div className="field"><label htmlFor="n">Full name</label><input id="n" value={f.name} onChange={set('name')} required /></div>
        <div className="field"><label htmlFor="s">Student ID</label><input id="s" value={f.studentId} onChange={set('studentId')} required /></div>
        <div className="field"><label htmlFor="e">Email</label><input id="e" type="email" value={f.email} onChange={set('email')} required /></div>
        <div className="field"><label htmlFor="p">Password (8+ characters)</label><input id="p" type="password" minLength={8} value={f.password} onChange={set('password')} required /></div>
        <button className="btn" style={{ width: '100%', marginBottom: 14 }} disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
      </form>
    </AuthCard>
  );
}
