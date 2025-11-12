import { useEffect, useState } from "react";
import axios from "axios";
import "./ManageCourses.css";

function ManageCourses() {
  const [pending, setPending] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [actId, setActId] = useState("");

  useEffect(() => {
    fetchPending();
    fetchUserStats();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/courses/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPending(res.data);
      setError("");
    } catch (err) {
      setError("Could not fetch pending courses.");
      setPending([]);
    }
    setLoading(false);
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/users/count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserStats(res.data);
    } catch (err) {
      console.error("Could not fetch user statistics:", err);
    }
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
      // Remove from list
      setPending((curr) => curr.filter((c) => c._id !== id));
    } catch {
      alert("Action failed. Try again.");
    }
    setActId("");
  };

  return (
    <div className="manage-courses">
      <h2 className="manage-courses-title">Manage Courses</h2>
      
      {/* User Statistics Section */}
      {userStats && (
        <div className="user-stats-section">
          <h3 className="user-stats-title">User Statistics</h3>
          <div className="user-stats-grid">
            <div className="user-stat-card">
              <div className="user-stat-label">Students</div>
              <div className="user-stat-value">{userStats.students ?? "-"}</div>
            </div>
            <div className="user-stat-card">
              <div className="user-stat-label">Lecturers</div>
              <div className="user-stat-value">{userStats.lecturers ?? "-"}</div>
            </div>
            <div className="user-stat-card">
              <div className="user-stat-label">Admins</div>
              <div className="user-stat-value">{userStats.admins ?? "-"}</div>
            </div>
            <div className="user-stat-card">
              <div className="user-stat-label">Total Users</div>
              <div className="user-stat-value">{userStats.total ?? "-"}</div>
            </div>
          </div>
        </div>
      )}

      <h3 className="pending-title">Pending Courses</h3>
      {error && <p className="manage-courses-error">{error}</p>}
      {loading && <div className="manage-courses-loading">Loading...</div>}
      <div className="pending-list">
        {pending.length === 0 && !loading ? (
          <p className="pending-empty">No pending courses.</p>
        ) : null}
        {pending.map((course) => (
          <div className="pending-card" key={course._id}>
            <div>
              <b>{course.title}</b>{" "}
              <span className="pending-id">(ID {course._id.slice(-4)})</span>
            </div>
            <div>
              <b>Lecturer:</b> {course.lecturer?.name} ({course.lecturer?.email})
            </div>
            <div>
              <b>Category:</b> {course.category}
            </div>
            <div className="pending-actions">
              <button
                className="btn-approve"
                disabled={actId === course._id + "approve"}
                onClick={() => handleDecision(course._id, "approve")}
              >
                {actId === course._id + "approve" ? "Approving..." : "Approve"}
              </button>
              <button
                className="btn-reject"
                disabled={actId === course._id + "reject"}
                onClick={() => handleDecision(course._id, "reject")}
              >
                {actId === course._id + "reject" ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageCourses;

