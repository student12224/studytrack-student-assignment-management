export const formatDate = value => value
  ? new Date(value).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })
  : "Not set";
export const readableStatus = value => (value || "pending").replaceAll("-", " ");
export const getInitial = name => (name || "S").trim().charAt(0).toUpperCase() || "S";
