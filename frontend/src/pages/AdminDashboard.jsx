import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [actId, setActId] = useState("");

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

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/courses/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPending(res.data);
    } catch {
      setPending([]);
    }
    setLoading(false);
  };

  const handleDecision = async (id, status) => {
    setActId(id + status);
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/courses/${id}/${status}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Remove list
      setPending((curr) => curr.filter((c) => c._id !== id));
    } catch {
      alert("Action failed. Try again.");
    }
    setActId("");
  };

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

      <h3 className="pending-title">Pending Courses</h3>
      {loading && <div className="admin-loading">Loading...</div>}
      <div className="pending-list">
        {pending.length === 0 && !loading ? <p className="pending-empty">No pending courses.</p> : null}
        {pending.map((course) => (
          <div className="pending-card" key={course._id}>
            <div><b>{course.title}</b> <span className="pending-id">(ID {course._id.slice(-4)})</span></div>
            <div><b>Lecturer:</b> {course.lecturer?.name} ({course.lecturer?.email})</div>
            <div><b>Category:</b> {course.category}</div>
            <div className="pending-actions">
              <button
                className="btn-approve"
                disabled={actId === course._id + "approve"}
                onClick={() => handleDecision(course._id, "approve")}
              >{actId === course._id + "approve" ? "Approving..." : "Approve"}</button>
              <button
                className="btn-reject"
                disabled={actId === course._id + "reject"}
                onClick={() => handleDecision(course._id, "reject")}
              >{actId === course._id + "reject" ? "Rejecting..." : "Reject"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
