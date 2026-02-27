import api from "../utils/api";

export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};
