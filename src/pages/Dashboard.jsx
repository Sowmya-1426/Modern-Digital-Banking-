import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import API from "../utils/api";
import { formatINR } from "../utils/format";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#eab308",
  "#ef4444",
];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [spending, setSpending] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const summaryRes = await API.get("/dashboard/summary");
      const txRes = await API.get("/transactions");

      // sort + take ONLY 5 latest transactions
      const lastFive = txRes.data
        .slice()
        .sort(
          (a, b) =>
            new Date(b.txn_date) - new Date(a.txn_date)
        )
        .slice(0, 5);

      setSummary(summaryRes.data);
      setSpending(summaryRes.data.spending_distribution || []);
      setRecentTx(lastFive);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <StatCard
            title="Total Balance"
            value={`₹ ${formatINR(summary.balance)}`}
          />
          <StatCard
            title="Accounts"
            value={summary.accounts}
          />
          <StatCard
            title="Income"
            value={`₹ ${formatINR(summary.income)}`}
            color="text-green-600"
          />
          <StatCard
            title="Expenses"
            value={`₹ ${formatINR(summary.expenses)}`}
            color="text-red-600"
          />
          <StatCard
            title="Reward Points"
            value={summary.reward_points}
          />
        </div>
      )}

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* SPENDING DISTRIBUTION */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Spending Distribution
          </h2>

          {spending.length === 0 ? (
            <p className="text-gray-500">No data</p>
          ) : (
            <>
              {/* PIE CHART */}
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={spending}
                    dataKey="amount"
                    nameKey="category"
                    outerRadius={110}
                    label
                  >
                    {spending.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `₹ ${formatINR(v)}`} />
                </PieChart>
              </ResponsiveContainer>

              {/* CATEGORY NAMES BELOW CHART */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {spending.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          COLORS[index % COLORS.length],
                      }}
                    />
                    <span className="text-gray-700 font-medium">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Recent Transactions
          </h2>

          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="p-4">Date</th>
                <th>Description</th>
                <th>Category</th>
                <th className="text-right pr-4">Amount</th>
              </tr>
            </thead>

            <tbody>
              {recentTx.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-6 text-center text-gray-500"
                  >
                    No recent transactions
                  </td>
                </tr>
              ) : (
                recentTx.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      {tx.txn_date?.slice(0, 10)}
                    </td>
                    <td>{tx.description || "-"}</td>
                    <td>{tx.category || "Others"}</td>
                    <td
                      className={`text-right pr-4 font-medium ${
                        tx.txn_type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {tx.txn_type === "credit" ? "+" : "-"}₹{" "}
                      {formatINR(tx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* CARD COMPONENT */
function StatCard({ title, value, color = "text-black" }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}
