import API from "../utils/api";

export const getCashflow = async () => {
  const res = await API.get("/insights/cashflow");
  return res.data;
};

export const getBurnRate = async () => {
  const res = await API.get("/insights/burn-rate");
  return res.data;
};

export const getTopMerchants = async () => {
  const res = await API.get("/insights/top-merchants");
  return res.data;
};
