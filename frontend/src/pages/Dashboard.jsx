import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [payingId, setPayingId] = useState("");
  const [materialsOpen, setMaterialsOpen] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [materialsError, setMaterialsError] = useState("");
  const [progress, setProgress] = useState({ completed: 0, total: 0, percent: 0 });
  const [completing, setCompleting] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/enrollments/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEnrollments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEnrollments();
    fetchProgress();
  }, []);

  // student progress
  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/enrollments/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgress(res.data);
    } catch (err) {
      setProgress({ completed: 0, total: 0, percent: 0 });
    }
  };

  const handleMarkComplete = async (enrollmentId) => {
    setCompleting(enrollmentId);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/enrollments/${enrollmentId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrollments((current) =>
        current.map((e) =>
          e._id === enrollmentId ? { ...e, status: "completed" } : e
        )
      );
      fetchProgress();
    } catch {
      alert("Could not mark as completed");
    }
    setCompleting("");
  };

  // Pay enrollment
  const handlePay = async (enrollmentId) => {
    setPayingId(enrollmentId);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/payment/",
        { enrollmentId, method: "mock" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update paid
      setEnrollments((current) =>
        current.map((e) =>
          e._id === enrollmentId ? { ...e, paymentStatus: "paid" } : e
        )
      );
      alert("Payment successful!");
    } catch (err) {
      alert("Payment failed.");
    }
    setPayingId("");
  };

  // View Materials
  const handleViewMaterials = async (courseId) => {
    setMaterialsOpen(courseId);
    setLoadingMaterials(true);
    setMaterialsError("");
    setMaterials([]);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/courses/${courseId}/materials`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaterials(res.data.materials);
    } catch (err) {
      setMaterialsError("Could not fetch materials.");
    }
    setLoadingMaterials(false);
  };

  const closeMaterials = () => {
    setMaterialsOpen("");
    setMaterials([]);
    setMaterialsError("");
    setLoadingMaterials(false);
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">My Enrollments</h2>
      <section className="section-progress">
        <h3>Your Progress</h3>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: progress.percent + '%' }}></div>
        </div>
        <div className="progress-stats">
          {progress.completed} / {progress.total} modules completed ({progress.percent}%)
        </div>
      </section>
      {enrollments.length === 0 ? (
        <p className="dashboard-empty">No enrollments found.</p>
      ) : (
        <div className="enrollment-list">
          {enrollments.map((en) => (
            <div key={en._id} className="enrollment-card">
              <h3 className="enrollment-course">{en.course?.title || "Untitled Course"}</h3>
              <p className="enrollment-category"><b>Category:</b> {en.course?.category}</p>
              <p className="enrollment-payment"><b>Payment Status:</b> {en.paymentStatus || "Paid"}</p>
              <p className="enrollment-status"><b>Status:</b> {en.status || "-"}</p>
              {en.paymentStatus === "pending" && (
                <button
                  className="btn-pay"
                  onClick={() => handlePay(en._id)}
                  disabled={payingId === en._id}
                >
                  {payingId === en._id ? "Paying..." : "Pay Now"}
                </button>
              )}
              {en.paymentStatus === "paid" && en.status !== "completed" && (
                <button
                  className="btn-complete"
                  onClick={() => handleMarkComplete(en._id)}
                  disabled={completing === en._id}
                >
                  {completing === en._id ? "Marking..." : "Mark Complete"}
                </button>
              )}
              {en.paymentStatus === "paid" && en.course?._id && (
                <button
                  className="btn-materials"
                  onClick={() => handleViewMaterials(en.course._id)}
                >
                  View Materials
                </button>
              )}
              {/* Material Modal */}
              {materialsOpen === en.course?._id && (
                <div className="dashboard-materials-modal">
                  <div className="dashboard-materials">
                    <button className="close-btn" onClick={closeMaterials}>&times;</button>
                    <h4>Course Materials</h4>
                    {loadingMaterials ? <p>Loading materials...</p> : null}
                    {materialsError ? (
                      <p className="materials-error">{materialsError}</p>
                    ) : (
                      <ul className="materials-list">
                        {materials.length === 0 ? (
                          <li>No materials uploaded yet.</li>
                        ) : (
                          materials.map((m, idx) => (
                            <li key={m}>
                              <a href={`http://localhost:5000/${m}`} target="_blank" rel="noopener noreferrer">
                                Material {idx + 1}
                              </a>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
