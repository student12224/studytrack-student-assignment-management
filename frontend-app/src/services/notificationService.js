import api, { unwrap } from "../api.js";
export const getNotifications = async () => {
  const result = unwrap(await api.get("/notifications"));
  return Array.isArray(result) ? result : result.notifications || result.data || [];
};
export const markNotificationRead = async id => unwrap(await api.patch(`/notifications/${id}/read`));
