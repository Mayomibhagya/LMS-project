import { useEffect, useState } from "react";
import axios from "axios";
import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
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
    //  mark enrolled courses
    if (role === "student" && token) {
      (async () => {
        try {
          const res = await axios.get(
            "http://localhost:5000/api/enrollments/my",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const ids = (res.data || [])
            .map((e) => e.course?._id)
            .filter(Boolean);
          setEnrolledCourseIds(ids);
        } catch (err) {
          
        }
      })();
    }
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
      
      setEnrolledCourseIds((curr) => (curr.includes(courseId) ? curr : [...curr, courseId]));
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
            <p className="course-duration"><b>Duration:</b> {c.duration ? c.duration : "N/A"}</p>
            {role === "student" && (
              enrolledCourseIds.includes(c._id) ? (
                <button className="course-enroll-btn" disabled>
                  Enrolled
                </button>
              ) : (
                <button className="course-enroll-btn" onClick={() => handleEnroll(c._id)}>
                  Enroll
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
