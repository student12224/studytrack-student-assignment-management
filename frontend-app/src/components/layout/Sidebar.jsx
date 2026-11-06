import { NavLink, useNavigate } from "react-router-dom";
import { BookOpenCheck, LayoutDashboard, ClipboardList, Bell, UserRound, LogOut, Sparkles, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getInitial } from "../../utils/formatters.js";

const links = [
  ["/", "Overview", LayoutDashboard],
  ["/assignments", "My assignments", ClipboardList],
  ["/notifications", "Notifications", Bell],
  ["/profile", "Profile settings", UserRound]
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = async () => { await logout(); navigate("/login"); };
  return <>
    {open && <button className="mobile-scrim" onClick={onClose} aria-label="Close navigation" />}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand"><span><BookOpenCheck size={20}/></span> studytrack <button className="mobile-close" onClick={onClose}><X size={19}/></button></div>
      <small className="nav-label">WORKSPACE</small>
      <nav>{links.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === "/"} onClick={onClose}><Icon size={18}/>{label}</NavLink>)}</nav>
      <div className="sidebar-bottom">
        <div className="sidebar-tip"><Sparkles size={18}/><b>Make progress, daily.</b><p>Small focused steps add up to meaningful academic progress.</p></div>
        <div className="sidebar-user"><span className="avatar">{getInitial(user?.name)}</span><div><b>{user?.name || "Student"}</b><small>{user?.email || ""}</small></div><button onClick={signOut} aria-label="Sign out"><LogOut size={17}/></button></div>
      </div>
    </aside>
  </>;
}
