import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock3, ClipboardList } from "lucide-react";
import { getAssignments } from "../services/assignmentService.js";
import { getDashboard } from "../services/dashboardService.js";
import StatCard from "../components/dashboard/StatCard.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import { formatDate } from "../utils/formatters.js";

export default function DashboardPage() {
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({});
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.allSettled([getAssignments(), getDashboard()]).then(([assignmentResult, dashboardResult]) => {
      if (assignmentResult.status === "fulfilled") setAssignments(assignmentResult.value);
      else setError(assignmentResult.reason?.userMessage || "Could not load assignments.");
      if (dashboardResult.status === "fulfilled") {
        const result = dashboardResult.value;
        setStats(result.statistics || result.stats || result.data?.statistics || {});
      }
    });
  }, []);
  const calculated = {
    total: assignments.length,
    completed: assignments.filter(a => a.status === "completed").length,
    inProgress: assignments.filter(a => a.status === "in-progress").length,
    pending: assignments.filter(a => !["completed", "in-progress"].includes(a.status)).length
  };
  const values = { ...calculated, ...stats };
  const percent = values.total ? Math.round((values.completed / values.total) * 100) : 0;
  const upcoming = [...assignments].filter(a => a.status !== "completed").sort((a,b) => new Date(a.dueDate)-new Date(b.dueDate)).slice(0,5);
  return <>
    <div className="page-heading"><small className="eyebrow">YOUR ACADEMIC SPACE</small><h1>Overview</h1><p>Plan, prioritise and keep your academic work moving forward.</p></div>
    <section className="welcome-banner"><div><small>✦ &nbsp; YOUR PROGRESS, AT A GLANCE</small><h2>Good work starts with<br/>a clear next step.</h2><p>Keep your priorities visible and make steady progress.</p><Link to="/assignments">View all assignments ↗</Link></div><div className="completion-box"><small>COMPLETION RATE</small><strong>{percent}%</strong><div className="progress-track"><i style={{width:`${percent}%`}}/></div><small>{values.completed} of {values.total} completed</small></div></section>
    {error && <div className="alert-error">{error}</div>}
    <div className="section-heading"><div><small className="eyebrow">YOUR WORKLOAD</small><h2>Academic overview</h2></div><Link to="/assignments">Manage work ↗</Link></div>
    <div className="stats-grid">
      <StatCard icon={CalendarDays} label="Total assignments" value={values.total} note="Across all modules" tone="blue"/>
      <StatCard icon={CheckCircle2} label="Completed" value={values.completed} note="Successfully finished" tone="green"/>
      <StatCard icon={Clock3} label="In progress" value={values.inProgress} note="Currently underway" tone="purple"/>
      <StatCard icon={ClipboardList} label="Pending" value={values.pending} note="Waiting to be started" tone="amber"/>
    </div>
    <div className="dashboard-grid"><section className="surface-card"><div className="card-heading"><div><small className="eyebrow">COMING UP</small><h3>Upcoming deadlines</h3></div><Link to="/assignments">↗</Link></div>
      {upcoming.length ? upcoming.map(item => <div className="deadline-row" key={item._id}><div className="date-tile"><b>{item.dueDate ? new Date(item.dueDate).getDate() : "—"}</b><small>{item.dueDate ? new Date(item.dueDate).toLocaleDateString("en",{month:"short"}) : "DATE"}</small></div><div className="deadline-copy"><b>{item.title}</b><small>{item.subject || "General"} · {formatDate(item.dueDate)}</small></div><StatusBadge status={item.status}/></div>) : <p className="empty-state">No upcoming assignments. Add a task to get started.</p>}
    </section><section className="surface-card progress-card"><small className="eyebrow">MOMENTUM</small><h3>Completion progress</h3><div className="progress-ring" style={{"--progress":`${percent * 3.6}deg`}}><div><b>{percent}%</b><small>COMPLETE</small></div></div><b>{values.completed} assignments completed</b><small>{Math.max(0, values.total-values.completed)} still on your list</small><Link className="button-outline" to="/assignments">Review assignments ↗</Link></section></div>
  </>;
}
