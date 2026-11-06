import api, { unwrap } from "../api.js";
export const getDashboard = async () => unwrap(await api.get("/dashboard"));
