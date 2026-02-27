import API from "../utils/api";

export const getAlerts = async () => {
  const res = await API.get("/alerts");
  return res.data;
};
