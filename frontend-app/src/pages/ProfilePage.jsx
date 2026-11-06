import { useEffect, useState } from "react";
import { UserRound, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getProfile, updateProfile } from "../services/userService.js";
import { getErrorMessage } from "../api.js";

export default function ProfilePage() {
  const { user,setUser } = useAuth();
  const [name,setName] = useState(user?.name || ""), [message,setMessage] = useState(""), [error,setError] = useState("");
  useEffect(()=>{getProfile().then(result=>{const profile=result.user||result;setName(profile.name||user?.name||"");}).catch(()=>{});},[]);
  const submit = async event => {
    event.preventDefault();setMessage("");setError("");
    try { const result=await updateProfile({name});const profile=result.user||result;setUser(current=>({...current,...profile,name:profile.name||name}));setMessage("Profile updated successfully."); }
    catch(e) { setError(getErrorMessage(e)); }
  };
  return <><div className="page-heading"><small className="eyebrow">ACCOUNT DETAILS</small><h1>Profile settings</h1><p>Manage the personal details associated with your student account.</p></div><div className="profile-grid"><section className="surface-card profile-summary"><div className="profile-avatar"><UserRound/></div><h3>{name||"Student"}</h3><p>{user?.email}</p><span>STUDENT ACCOUNT</span></section><section className="surface-card"><h3>Personal information</h3>{message&&<div className="alert-success">{message}</div>}{error&&<div className="alert-error">{error}</div>}<form className="form-grid" onSubmit={submit}><label>Full name<input required minLength="2" maxLength="80" value={name} onChange={e=>setName(e.target.value)}/></label><label>Email address<input disabled value={user?.email||""}/><small>Email address is linked to your account.</small></label><button className="button-primary"><Save size={15}/> Save changes</button></form></section></div></>;
}
