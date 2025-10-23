import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Courses from "./pages/Courses";

function App() {
  const navbarStyle = {
    backgroundColor: "#222",
    color: "#fff",
    padding: "15px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const navLinks = {
    listStyle: "none",
    display: "flex",
    gap: "20px",
  };

  const containerStyle = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
  };

  return (
    <Router>
      <nav style={navbarStyle}>
        <h2>Mini LMS</h2>
        <ul style={navLinks}>
          <li><Link style={linkStyle} to="/">Home</Link></li>
          <li><Link style={linkStyle} to="/courses">Courses</Link></li>
          <li><Link style={linkStyle} to="/login">Login</Link></li>
        </ul>
      </nav>

      <div style={containerStyle}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
