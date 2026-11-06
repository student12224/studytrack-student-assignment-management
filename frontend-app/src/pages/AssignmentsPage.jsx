import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Filter, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { getAssignments, createAssignment, updateAssignment, deleteAssignment } from "../services/assignmentService.js";
import AssignmentModal from "../components/assignments/AssignmentModal.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import { formatDate } from "../utils/formatters.js";
import { getErrorMessage } from "../api.js";

export default function AssignmentsPage() {
  const [items,setItems] = useState([]), [query,setQuery] = useState(""), [filter,setFilter] = useState("all");
  const [modal,setModal] = useState(null), [busy,setBusy] = useState(false), [error,setError] = useState(""), [loading,setLoading] = useState(true);
  const load = async () => { try { setItems(await getAssignments()); setError(""); } catch(e) { setError(getErrorMessage(e)); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const visible = useMemo(() => items.filter(item => (filter === "all" || item.status === filter) && `${item.title} ${item.subject} ${item.description || ""}`.toLowerCase().includes(query.toLowerCase())), [items,filter,query]);
  const save = async payload => {
    setBusy(true); setError("");
    try { if(modal.item) await updateAssignment(modal.item._id,payload); else await createAssignment(payload); setModal(null); await load(); }
    catch(e) { setError(getErrorMessage(e)); } finally { setBusy(false); }
  };
  const remove = async item => {
    if(!window.confirm(`Delete "${item.title}"?`)) return;
    try { await deleteAssignment(item._id); await load(); } catch(e) { setError(getErrorMessage(e)); }
  };
  const toggleComplete = async item => {
    try { await updateAssignment(item._id,{status:item.status === "completed" ? "pending" : "completed"}); await load(); }
    catch(e) { setError(getErrorMessage(e)); }
  };
  return <>
    <div className="page-heading"><small className="eyebrow">PLAN AND PRIORITISE</small><h1>My assignments</h1><p>Keep every deliverable visible and every deadline under control.</p></div>
    <div className="toolbar"><div className="search-field"><Search size={17}/><input placeholder="Search assignments or subjects…" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="toolbar-actions"><div className="filter-select"><Filter size={15}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="in-progress">In progress</option><option value="completed">Completed</option></select></div><button className="button-primary" onClick={()=>setModal({item:null})}><Plus size={16}/> New assignment</button></div></div>
    {error && <div className="alert-error">{error}</div>}<p className="result-count">{visible.length} assignments shown</p>
    {loading ? <div className="empty-state">Loading assignments…</div> : visible.length ? <div className="assignment-grid">{visible.map(item=><article className="assignment-card" key={item._id}><div className="assignment-top"><span className={`priority-dot ${item.priority || "medium"}`}/><StatusBadge status={item.status}/><div className="card-actions"><button onClick={()=>setModal({item})} aria-label="Edit assignment"><Pencil size={15}/></button><button onClick={()=>remove(item)} aria-label="Delete assignment"><Trash2 size={15}/></button></div></div><small className="subject-label">{item.subject || "GENERAL"}</small><h3>{item.title}</h3><p>{item.description || "No description added."}</p><div className="assignment-meta"><span><CalendarDays size={14}/> Due {formatDate(item.dueDate)}</span><span className={`priority-text ${item.priority || "medium"}`}>{item.priority || "medium"} priority</span></div><div className="assignment-footer"><button onClick={()=>toggleComplete(item)}>{item.status === "completed" ? "Reopen assignment" : "Mark complete"}</button></div></article>)}</div> : <div className="empty-panel"><h3>No matching assignments</h3><p>Create your first assignment or adjust your search and filters.</p><button className="button-primary" onClick={()=>setModal({item:null})}><Plus size={16}/> Create assignment</button></div>}
    {modal && <AssignmentModal item={modal.item} onClose={()=>setModal(null)} onSave={save} busy={busy}/>}
  </>;
}
