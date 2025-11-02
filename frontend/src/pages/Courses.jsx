import { useEffect, useState } from "react";
import axios from "axios";
import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

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

  // handle student enrollment
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

  if (loading) return <p className="courses-loading">Loading...</p>;

  return (
    <div className="courses-container">
      <h2 className="courses-title">Available Courses</h2>
      <div className="courses-grid">
        {courses.map((c) => (
          <div key={c._id} className="course-card">
            <h3 className="course-name">{c.title}</h3>
            <p className="course-desc">{c.description}</p>
            <p className="course-cat"><b>Category:</b> {c.category}</p>
            <p className="course-price"><b>Price:</b> RS.{c.price}</p>
            {role === "student" && (
              <button className="course-enroll-btn" onClick={() => handleEnroll(c._id)}>
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
