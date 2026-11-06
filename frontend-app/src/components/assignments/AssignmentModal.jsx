import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

export default function AssignmentModal({ item, onClose, onSave, busy }) {
  const [form, setForm] = useState({ title: "", description: "", subject: "", dueDate: "", priority: "medium", status: "pending" });
  useEffect(() => {
    setForm({
      title: item?.title || "", description: item?.description || "", subject: item?.subject || "",
      dueDate: item?.dueDate ? new Date(item.dueDate).toISOString().slice(0, 10) : "",
      priority: item?.priority || "medium", status: item?.status || "pending"
    });
  }, [item]);
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = event => {
    event.preventDefault();
    onSave({ ...form, dueDate: new Date(`${form.dueDate}T12:00:00`).toISOString() });
  };
  return <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="modal"><div className="modal-heading"><div><small className="eyebrow">STUDYTRACK</small><h2>{item ? "Edit assignment" : "Create an assignment"}</h2></div><button onClick={onClose} aria-label="Close"><X/></button></div>
      <form className="form-grid" onSubmit={submit}>
        <label>Assignment title<input name="title" required value={form.title} onChange={change}/></label>
        <div className="form-row"><label>Subject<input name="subject" required value={form.subject} onChange={change}/></label><label>Due date<input name="dueDate" type="date" required value={form.dueDate} onChange={change}/></label></div>
        <label>Description<textarea name="description" rows="3" value={form.description} onChange={change}/></label>
        <div className="form-row"><label>Priority<select name="priority" value={form.priority} onChange={change}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label>Status<select name="status" value={form.status} onChange={change}><option value="pending">Pending</option><option value="in-progress">In progress</option><option value="completed">Completed</option></select></label></div>
        <div className="modal-actions"><button type="button" className="button-muted" onClick={onClose}>Cancel</button><button className="button-primary" disabled={busy}><Save size={15}/>{busy ? "Saving…" : "Save assignment"}</button></div>
      </form>
    </section>
  </div>;
}
