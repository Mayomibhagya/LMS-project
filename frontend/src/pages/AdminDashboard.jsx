import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
        setError("");
      } catch (e) {
        setError("Could not fetch admin stats.");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2 className="admin-title">Admin Dashboard</h2>
      {error && <p className="admin-error">{error}</p>}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{stats?.totalUsers ?? "-"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Courses</div>
          <div className="stat-value">{stats?.totalCourses ?? "-"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Enrollments</div>
          <div className="stat-value">{stats?.totalEnrollments ?? "-"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Payments</div>
          <div className="stat-value">{stats?.totalPayments ?? "-"}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
