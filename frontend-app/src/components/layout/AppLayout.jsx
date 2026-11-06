import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

const titles = { "/": "Overview", "/assignments": "My assignments", "/notifications": "Notifications", "/profile": "Profile settings" };
export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return <div className="app-shell">
    <Sidebar open={open} onClose={() => setOpen(false)} />
    <main className="main-area">
      <header className="topbar">
        <button className="menu-button" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu/></button>
        <span>Workspace <i>/</i> <b>{titles[location.pathname] || "Overview"}</b></span>
        <time>{new Date().toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}</time>
      </header>
      <div className="page-content"><Outlet/><footer>© {new Date().getFullYear()} StudyTrack <span>Designed for focused learning</span></footer></div>
    </main>
  </div>;
}
