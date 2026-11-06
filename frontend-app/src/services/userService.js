import api, { unwrap } from "../api.js";
export const getProfile = async () => unwrap(await api.get("/users/me"));
export const updateProfile = async payload => unwrap(await api.put("/users/me", payload));
