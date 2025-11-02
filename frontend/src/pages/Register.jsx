import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const box = {
    width: "340px",
    margin: "60px auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 0 8px rgba(0,0,0,0.2)",
    textAlign: "center",
  };
  const inputStyle = {
    width: "100%",
    padding: "8px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };
  const buttonStyle = {
    width: "100%",
    padding: "10px",
    background: "#0078ff",
    border: "none",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "4px",
    marginTop: "10px",
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { name, email, password, role });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={box}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input style={inputStyle} type="text" placeholder="Name" required onChange={(e) => setName(e.target.value)} />
        <input style={inputStyle} type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
        <input style={inputStyle} type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
        <select style={inputStyle} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
        </select>
        <button style={buttonStyle} type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
