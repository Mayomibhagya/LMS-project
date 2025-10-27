import { useEffect, useState } from "react";
import axios from "axios";

function LecturerDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const box = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  };

  const formStyle = {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 0 6px rgba(0,0,0,0.2)",
    marginBottom: "20px",
    width: "350px",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const buttonStyle = {
    backgroundColor: "#0078ff",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
  };

  const card = {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/courses/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Add course
  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/courses",
        { title, description, category, price },
        { headers: { Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
    },
 }
      );
      alert("Course added successfully!");
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Failed to add course");
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  return (
    <div style={box}>
      <h2>Lecturer Dashboard</h2>

      <form style={formStyle} onSubmit={handleAddCourse}>
        <h3>Add New Course</h3>
        <input
          style={inputStyle}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          style={inputStyle}
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          style={inputStyle}
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          style={inputStyle}
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button style={buttonStyle} type="submit">
          Add Course
        </button>
      </form>

      <h3>My Courses</h3>
      <div style={grid}>
        {courses.map((course) => (
          <div key={course._id} style={card}>
            <h4>{course.title}</h4>
            <p>{course.description}</p>
            <p><b>Category:</b> {course.category}</p>
            <p><b>Price:</b> ${course.price}</p>
            <button
              style={{ ...buttonStyle, backgroundColor: "red" }}
              onClick={() => handleDelete(course._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LecturerDashboard;
