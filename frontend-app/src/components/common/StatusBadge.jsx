import { readableStatus } from "../../utils/formatters.js";
export default function StatusBadge({ status }) {
  return <span className={`status-badge ${status || "pending"}`}>{readableStatus(status)}</span>;
}
