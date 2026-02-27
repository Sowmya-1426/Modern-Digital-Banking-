import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAlerts } from "../services/alertsService";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [showWelcomeToast, setShowWelcomeToast] = useState(true);

  const welcomeUser = user?.name || "User";

  // 🔍 SEARCH HANDLER (REAL WORLD)
  const handleSearch = (value) => {
    setSearch(value);

    const keyword = value.toLowerCase().trim();

    if (keyword === "dashboard") navigate("/dashboard");
    else if (keyword === "accounts") navigate("/accounts");
    else if (keyword === "transactions") navigate("/transactions");
    else if (keyword === "budgets") navigate("/budgets");
    else if (keyword === "bills") navigate("/bills");
    else if (keyword === "rewards") navigate("/rewards");
    else if (keyword === "insights") navigate("/insights");
    else if (keyword === "alerts") navigate("/alerts");
    else if (keyword === "settings") navigate("/settings");
    else if (keyword === "help") navigate("/help");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔔 LOAD ALERTS
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await getAlerts();

        // show only unread alerts (real world)
        const unread = data.filter((a) => !a.read);
        setAlerts(unread.slice(0, 5));
      } catch {
        console.error("Failed to load alerts");
      }
    };

    loadAlerts();
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔔 MARK ALERTS AS READ WHEN OPENED
  const handleOpenNotifications = () => {
    setOpenNotify(!openNotify);

    if (!openNotify) {
      // mark all as read
      const updated = alerts.map((a) => ({ ...a, read: true }));
      setAlerts([]);
    }
  };

  // 🎉 WELCOME TOAST
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeToast(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "#E9E8FF" }}
    >
      {/* WELCOME TOAST */}
      {showWelcomeToast && (
        <div className="fixed top-6 right-6 z-[999]">
          <div
            className="px-6 py-3 rounded-2xl shadow-2xl"
            style={{ backgroundColor: "#252070", color: "white" }}
          >
            <div className="font-semibold text-base">
              Welcome {welcomeUser} 🎉
            </div>
            <div className="text-sm opacity-80">Login successful</div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside
          className="w-64 text-white flex flex-col"
          style={{ backgroundColor: "#252070" }}
        >
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
              🏦
            </div>
            <h1 className="text-lg font-bold">Digital Bank</h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <MenuLink to="/dashboard" icon="📊" label="Dashboard" />
            <MenuLink to="/accounts" icon="💳" label="Accounts" />
            <MenuLink to="/transactions" icon="🔁" label="Transactions" />
            <MenuLink to="/budgets" icon="📈" label="Budgets" />
            <MenuLink to="/bills" icon="🧾" label="Bills" />
            <MenuLink to="/rewards" icon="🎁" label="Rewards" />
            <MenuLink to="/insights" icon="📊" label="Insights" />
            <MenuLink to="/finAssist" icon="💬" label="FinAssist" />
            <MenuLink to="/alerts" icon="🔔" label="Alerts" />
            <MenuLink to="/settings" icon="⚙️" label="Settings" />
            <MenuLink to="/help" icon="❓" label="Help Center" />
          </nav>

          <div className="px-4 py-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10"
            >
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* MAIN SECTION */}
        <div className="flex-1 flex flex-col">
          {/* HEADER */}
          <header
            className="px-6 py-4 flex justify-between items-center"
            style={{
              backgroundColor: "#E9E8FF",
              borderBottom: "2px solid #252070",
            }}
          >
            <div
              className="flex items-center px-4 py-2 rounded-full w-[500px]"
              style={{ backgroundColor: "#252070" }}
            >
              <span style={{ color: "white" }}>🔍</span>
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-transparent ml-2 outline-none w-full"
                style={{ color: "white" }}
                placeholder="Search dashboard..."
              />
            </div>

            <div className="flex items-center gap-6 relative">
              {/* NOTIFICATIONS */}
              <div className="relative">
                <button
                  onClick={handleOpenNotifications}
                  className="relative h-10 w-10 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: "#252070", color: "white" }}
                >
                  🔔
                  {alerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                      {alerts.length}
                    </span>
                  )}
                </button>

                {openNotify && (
                  <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg border z-50">
                    <div className="p-3 font-semibold border-b">
                      Notifications
                    </div>
                    {alerts.length === 0 ? (
                      <div className="p-3 text-gray-500">
                        No new notifications
                      </div>
                    ) : (
                      alerts.map((n, i) => (
  <div
    key={i}
    onClick={() => {
      navigate("/alerts", { state: { alertId: n.id } });
      setAlerts((prev) => prev.filter((_, index) => index !== i));
      setOpenNotify(false);
    }}
    className="p-3 hover:bg-gray-100 border-b text-sm cursor-pointer"
  >
    {n.text || "New Alert"}
  </div>
))

                    )}
                  </div>
                )}
              </div>

              {/* PROFILE */}
              <div className="relative">
                <div
                  onClick={() => setOpenProfile(!openProfile)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <p className="font-medium">{user?.name}</p>
                  <div className="h-10 w-10 rounded-full bg-blue-900 text-white flex items-center justify-center">
                    👤
                  </div>
                </div>

                {openProfile && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border p-4 z-50">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      {user?.email}
                    </p>
                    <hr className="my-2" />
                    <button
                      onClick={() => navigate("/settings")}
                      className="block w-full text-left px-2 py-2 rounded hover:bg-gray-100"
                    >
                      ⚙️ Account Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-2 py-2 rounded text-red-600 hover:bg-red-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function MenuLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
          isActive
            ? "bg-blue-600/20 text-cyan-400"
            : "hover:bg-white/10 text-gray-300"
        }`
      }
    >
      <span>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
