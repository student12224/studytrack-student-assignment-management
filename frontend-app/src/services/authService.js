import api, { unwrap } from "../api.js";
export const loginRequest = async payload => unwrap(await api.post("/auth/login", payload));
export const registerRequest = async payload => unwrap(await api.post("/auth/register", payload));
export const logoutRequest = async () => unwrap(await api.post("/auth/logout"));
export const currentUserRequest = async () => unwrap(await api.get("/auth/me"));
