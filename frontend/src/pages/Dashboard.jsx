import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);

  const dashboardBox = {
    padding: "20px",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
  };

  const card = {
    background: "white",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  };

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/enrollments/my" , {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrollments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEnrollments();
  }, []);

  return (
    <div style={dashboardBox}>
      <h2>My Enrollments</h2>
      {enrollments.length === 0 ? (
        <p>No enrollments found.</p>
      ) : (
        enrollments.map((en) => (
          <div key={en._id} style={card}>
            <h3>{en.courseId?.title || "Untitled Course"}</h3>
            <p><b>Category:</b> {en.courseId?.category}</p>
            <p><b>Payment Status:</b> {en.paymentStatus || "Paid"}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
