import api, { unwrap } from "../api.js";
export const getAssignments = async () => {
  const result = unwrap(await api.get("/assignments"));
  return Array.isArray(result) ? result : result.assignments || result.data || [];
};
export const createAssignment = async payload => unwrap(await api.post("/assignments", payload));
export const updateAssignment = async (id, payload) => unwrap(await api.put(`/assignments/${id}`, payload));
export const deleteAssignment = async id => unwrap(await api.delete(`/assignments/${id}`));
