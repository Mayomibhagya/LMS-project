import { useEffect, useState } from "react";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);

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

  useEffect(() => {
    axios.get("http://localhost:5000/api/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Available Courses</h2>
      <div style={grid}>
        {courses.map((c) => (
          <div key={c._id} style={card}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <p><b>Category:</b> {c.category}</p>
            <p><b>Price:</b> ${c.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
