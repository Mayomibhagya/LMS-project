import { useEffect, useState } from "react";
import axios from "axios";
import "./LecturerDashboard.css";

function LecturerDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [uploadingId, setUploadingId] = useState("");
  const [files, setFiles] = useState({});
  const [materialList, setMaterialList] = useState({});

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
        { title, description, category, price, duration },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      alert("Course added successfully!");
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
      setDuration("");
      fetchCourses();
    } catch (err) {
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
      alert("Failed to delete");
    }
  };

  // Fetch course files
  const fetchMaterials = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/courses/${id}/materials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterialList((prev) => ({ ...prev, [id]: res.data.materials || [] }));
    } catch {
      setMaterialList((prev) => ({ ...prev, [id]: [] }));
    }
  };

  // Upload file
  const handleFileUpload = async (id, e) => {
    e.preventDefault();
    const file = files[id];
    if (!file) return alert("Please select a file first");
    setUploadingId(id);
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("file", file);
      await axios.post(`http://localhost:5000/api/courses/${id}/upload`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(f => ({ ...f, [id]: null }));
      alert("File uploaded!");
      fetchMaterials(id);
    } catch {
      alert("Upload failed");
    }
    setUploadingId("");
  };

  return (
    <div className="lecturer-dashboard">
      <h2>Lecturer Dashboard</h2>
      <form className="lecturer-form" onSubmit={handleAddCourse}>
        <h3>Add New Course</h3>
        <input
          className="lecturer-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="lecturer-input"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="lecturer-input"
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className="lecturer-input"
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="lecturer-input"
          type="text"
          placeholder="Course Duration (1 month)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <button className="btn-file" type="submit">
          Add Course
        </button>
      </form>
      <h3>My Courses</h3>
      <div className="lecturer-grid">
        
        {courses.map((course) => (
          <div key={course._id} className="lecturer-card">
            <h4>{course.title}</h4>
            <p>{course.description}</p>
            <p><b>Category:</b> {course.category}</p>
            <p><b>Price:</b> Rs.{course.price}</p>
            <p><b>Duration:</b> {course.duration ? course.duration : "N/A"}</p>

            <div className="card-actions">
              <form
                className="upload-form"
                onSubmit={(e) => handleFileUpload(course._id, e)}
                encType="multipart/form-data"
              >
                <input
                  type="file"
                  className="upload-input"
                  value={undefined}
                  onChange={e => setFiles(f => ({ ...f, [course._id]: e.target.files[0] }))}
                />
                <button
                  type="submit"
                  className="btn-file"
                  disabled={uploadingId === course._id}
                >
                  {uploadingId === course._id ? "Uploading..." : "Upload"}
                </button>
              </form>
              <button
                className="btn-file"
                onClick={() => fetchMaterials(course._id)}
                type="button"
              >Show Materials</button>
               
            </div>
            <ul className="file-list" style={{ marginTop: '5px' }}>
              {(materialList[course._id] || []).length === 0 ? (
                <li style={{ color: '#aaa' }}>No materials.</li>
              ) : (
                materialList[course._id]?.map((m, idx) => (
                  <li key={m}>
                    <a href={`http://localhost:5000/${m}`} target="_blank" rel="noopener noreferrer">
                     Lecture {idx + 1}
                    </a>
                  </li>
                ))
              )}
            </ul>
            <button
                className="btn-delete"
                onClick={() => handleDelete(course._id)}
              >Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LecturerDashboard;
