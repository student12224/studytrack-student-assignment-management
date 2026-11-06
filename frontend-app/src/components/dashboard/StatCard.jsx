export default function StatCard({ icon: Icon, label, value, note, tone }) {
  return <article className="stat-card"><div className="stat-label">{label}<span className={`stat-icon ${tone}`}><Icon size={18}/></span></div><strong>{value ?? 0}</strong><small>{note}</small></article>;
}
