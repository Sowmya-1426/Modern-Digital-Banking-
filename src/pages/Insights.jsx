import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import api from "../utils/api";
import { formatINR } from "../utils/format";

export default function Insights() {
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [burnRate, setBurnRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const [
        monthlyRes,
        categoryRes,
        merchantRes,
        burnRes,
      ] = await Promise.all([
        api.get("/insights/monthly-cashflow"),
        api.get("/insights/spending-by-category"),
        api.get("/insights/top-merchants"),
        api.get("/insights/burn-rate"),
      ]);

      /* ✅ FIX 1: Convert monthly object → array */
      const monthlyData = Object.entries(
        monthlyRes.data || {}
      ).map(([month, values]) => ({
        month,
        income: values.income || 0,
        expenses: values.expense || 0,
      }));

      setMonthly(monthlyData);
      setCategories(categoryRes.data || []);
      setMerchants(merchantRes.data || []);
      setBurnRate(burnRes.data || null);
    } catch (err) {
      console.error("Insights error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading insights...</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Insights</h1>

      {/* ================= MONTHLY INCOME VS EXPENSES ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">
          Monthly Income vs Expenses
        </h2>

        {monthly.length === 0 ? (
          <p className="text-gray-500">No monthly data</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip formatter={(v) => `₹ ${formatINR(v)}`} />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ================= BURN RATE ================= */}
      {burnRate && (
        <div className="bg-purple-600 text-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            Burn Rate (Last 30 Days)
          </h2>
          <p className="text-xl font-bold">
            ₹ {formatINR(burnRate.burn_rate)} / day
          </p>
        </div>
      )}

      {/* ================= SPENDING BY CATEGORY ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">
          Spending by Category
        </h2>

        {categories.length === 0 ? (
          <p className="text-gray-500">No category data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categories} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <YAxis type="category" dataKey="category" />
              <Tooltip formatter={(v) => `₹ ${formatINR(v)}`} />
              <Bar
                dataKey="amount"
                fill="#3b82f6"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ================= TOP MERCHANTS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">
          Top Merchants
        </h2>

        {merchants.length === 0 ? (
          <p className="text-gray-500">No merchant data</p>
        ) : (
          <ul className="space-y-3">
            {merchants.map((m, i) => (
              <li
                key={i}
                className="flex justify-between border-b pb-2 last:border-none"
              >
                <span className="font-medium">
                  {m.merchant || "Unknown"}
                </span>
                <span className="font-semibold text-red-600">
                  ₹ {formatINR(m.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
