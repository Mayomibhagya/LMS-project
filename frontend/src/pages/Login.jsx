import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const box = {
    width: "300px",
    margin: "80px auto",
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
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      alert("Login successful!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      window.location.href = "/"; // Redirect to home
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={box}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input style={inputStyle} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input style={inputStyle} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button style={buttonStyle} type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
