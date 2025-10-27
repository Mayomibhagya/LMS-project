import { useEffect, useState } from "react";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const box = {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f7f9fc",
    minHeight: "100vh",
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  };

  const card = {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  };

  const button = {
    marginTop: "10px",
    backgroundColor: "#0078ff",
    border: "none",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  //hndle student enrollmnt
  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/enrollments",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Enrolled successfully!");
    } catch (err) {
      console.error("Error enrolling in course:", err);
      alert("Failed to enroll");
    }
  };

  if (loading) return <p style ={{ textAlign: "center"}}>Loading...</p>;

  return (
    <div style ={box}>
      <h2>Available Courses</h2>
      <div style={grid}>
        {courses.map((c) => (
          <div key={c._id} style={card}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <p><b>Category:</b> {c.category}</p>
            <p><b>Price:</b> RS.{c.price}</p>

            {role === "student" && (
              <button style={button} onClick={() => handleEnroll(c._id)}>
                Enroll 
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
