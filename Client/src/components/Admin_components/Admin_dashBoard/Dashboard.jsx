import React, { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import AdminService from "../../../Services/AdminService";
import "./Dashboard.css";

const CATEGORY_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"];

const Dashboard = () => {
  const { getDashboardStats } = AdminService();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getDashboardStats();

      console.log("Dashboard stats response:", data);

      if (!data?.success) {
        throw new Error(data?.message || "Failed to load dashboard");
      }

      setStats(data.stats);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchStats();

    // Refetch whenever the tab/window regains focus, so numbers stay
    // current without needing a hard reload (e.g. after placing/updating
    // an order in another tab and switching back here).
    const handleFocus = () => fetchStats();
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchStats]);

  if (loading && !stats) {
    return <div className="dashboard-status">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-status dashboard-error">{error}</div>;
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-date">{today}</p>
        </div>
        <div className="dashboard-header-actions">
          <button
            className="refresh-btn"
            onClick={fetchStats}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "🔄 Refresh"}
          </button>
          <span className="status-pill">⚡ System Status: Online</span>
        </div>
      </div>

      <div className="stat-cards">
        <StatCard
          label="TOTAL SALES"
          value={`₹${stats.totalSales.toLocaleString("en-IN")}`}
          icon="💲"
          footnote="Realistic Store Total"
        />
        <StatCard
          label="TOTAL ORDERS"
          value={stats.totalOrders}
          icon="🛍️"
          footnote={`AOV: ₹${
            stats.totalOrders > 0
              ? Math.round(stats.totalSales / stats.totalOrders)
              : 0
          }`}
        />
        <StatCard
          label="PRODUCTS"
          value={stats.productsCount}
          icon="📦"
          footnote="Live in Catalog"
        />
        <StatCard
          label="CUSTOMERS"
          value={stats.customersCount}
          icon="👥"
          footnote="Registered Accounts"
        />
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Weekly Orders Overview</h3>
            <span className="realtime-pill">Realtime Sync</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.weeklyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Sales by Category</h3>
          </div>
          {stats.salesByCategory.length === 0 ? (
            <p className="no-data">No sales yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.salesByCategory}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {stats.salesByCategory.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                <Legend verticalAlign="bottom" height={24} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, footnote }) => (
  <div className="stat-card">
    <div className="stat-card-top">
      <span className="stat-label">{label}</span>
      <span className="stat-icon">{icon}</span>
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-footnote">{footnote}</div>
  </div>
);

export default Dashboard;