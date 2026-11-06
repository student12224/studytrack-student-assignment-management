import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, BookOpenCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../api.js";

export default function LoginPage({ mode = "login" }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault(); setError(""); setBusy(true);
    try { isRegister ? await register(form) : await login({ email: form.email, password: form.password }); navigate("/", { replace: true }); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setBusy(false); }
  };
  return <div className="auth-screen">
    <aside className="auth-aside"><div className="brand"><span><BookOpenCheck/></span> studytrack</div><div className="auth-hero"><small>YOUR ACADEMIC SPACE</small><h1>Make space for<br/><em>great work.</em></h1><p>Bring coursework, deadlines and daily priorities into one calm, organised workspace.</p></div><small className="auth-footer">FOCUS WITH INTENTION. FINISH WITH CONFIDENCE.</small></aside>
    <main className="auth-main"><form className="auth-form" onSubmit={submit}><small className="eyebrow">{isRegister ? "GET STARTED" : "WELCOME BACK"}</small><h2>{isRegister ? "Create your account" : "Sign in to StudyTrack"}</h2><p>{isRegister ? "Set up your personal workspace." : "Continue where you left off."}</p>
      {error && <div className="alert-error">{error}</div>}
      {isRegister && <label>Full name<input name="name" required minLength="2" maxLength="80" value={form.name} onChange={change} placeholder="Your name"/></label>}
      <label>Email address<input name="email" type="email" required value={form.email} onChange={change} placeholder="you@example.com"/></label>
      <label>Password<input name="password" type="password" required minLength={isRegister ? 8 : 1} value={form.password} onChange={change} placeholder="Enter your password"/></label>
      <button className="button-primary button-full" disabled={busy}>{busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"}<ArrowUpRight size={17}/></button>
      <div className="auth-switch">{isRegister ? "Already registered?" : "New to StudyTrack?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></div>
    </form></main>
  </div>;
}
