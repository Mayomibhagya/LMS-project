import { Link } from "react-router-dom";
import "./Home.css";
import bg from "../assets/a.jpg";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="home-container"
    style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh"
      }}
      >
      <div className="home-hero">
        <h1 className="home-title">Welcome to LMS</h1>
        <p className="home-subtitle">Learn, Enroll, and Grow with our comprehensive Learning Management System</p>
        {!token && (
          <div className="home-actions">
            <Link to="/register" className="home-btn-primary">Get Started</Link>
            <Link to="/login" className="home-btn-secondary">Login</Link>
          </div>
        )}
        {token && (
          <div className="home-actions">
            <Link to="/courses" className="home-btn-primary">Browse Courses</Link>
            <Link to="/dashboard" className="home-btn-secondary">My Dashboard</Link>
          </div>
        )}
      </div>

      <div className="home-features">
        <div className="home-feature-card">
          <h3>Courses</h3>
          <p>Access a wide range of courses created by expert instructors</p>
        </div>
        <div className="home-feature-card">
          <h3>Materials</h3>
          <p>Download course materials, PDFs, videos, and resources</p>
        </div>
        <div className="home-feature-card">
          <h3>Progress</h3>
          <p>Track your learning progress and completion status</p>
        </div>
        <div className="home-feature-card">
          <h3>Secure Payments</h3>
          <p>Safe and easy payment integration for course enrollments</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
