import { useEffect, useState } from "react";
import API from "../utils/api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all"); // all | unread | read
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
    loadUnreadCount();
  }, [filter]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const url =
        filter === "all" ? "/alerts" : `/alerts?status=${filter}`;
      const res = await API.get(url);
      setAlerts(res.data);
    } catch (err) {
      console.error("Alert fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const res = await API.get("/alerts/unread-count");
      setUnreadCount(res.data.unread);
    } catch (err) {
      console.error("Unread count error", err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await API.put(`/alerts/${id}/toggle`);
      loadAlerts();
      loadUnreadCount();
    } catch (err) {
      console.error("Toggle alert error", err);
    }
  };

  const badgeColor = (isRead) =>
    isRead
      ? "bg-gray-200 text-gray-700"
      : "bg-blue-600 text-white";

  const typeIcon = (type) => {
    switch (type) {
      case "LOW BALANCE":
        return "⚠️";
      case "BILL DUE":
        return "📄";
      case "BUDGET EXCEEDED":
        return "💸";
      default:
        return "🔔";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Alerts</h1>
        <p className="text-sm text-gray-500">
          {unreadCount} unread alerts
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-3">
        {["all", "unread", "read"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-6 py-3">Type</th>
              <th className="text-left px-6 py-3">Message</th>
              <th className="text-left px-6 py-3">Date & Time</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Loading alerts...
                </td>
              </tr>
            ) : alerts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No alerts found
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">
                    {typeIcon(alert.alert_type)}{" "}
                    {alert.alert_type}
                  </td>

                  <td className="px-6 py-4">
                    {alert.message}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(alert.created_at).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(
                        alert.is_read
                      )}`}
                    >
                      {alert.is_read ? "Read" : "Unread"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(alert.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {alert.is_read
                        ? "Mark Unread"
                        : "Mark Read"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
