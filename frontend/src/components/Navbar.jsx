// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0078ff",
    color: "white",
    padding: "10px 20px",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    margin: "0 10px",
    fontWeight: "bold",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav style={navbarStyle}>
      <div>
        <Link to="/" style={{ ...linkStyle, fontSize: "18px" }}>
          LMS
        </Link>
      </div>

      <div>
        {!token ? (
          <>
            {/* Guest */}
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/register" style={linkStyle}>
              Register
            </Link>
          </>
        ) : (
          <>
            {/* Student */}
            {role === "student" && (
              <>
                <Link to="/courses" style={linkStyle}>
                  Courses
                </Link>
                <Link to="/dashboard" style={linkStyle}>
                  Dashboard
                </Link>
              </>
            )}

            {/* Lecturer */}
            {role === "lecturer" && (
              <>
                <Link to="/lecturer" style={linkStyle}>
                  My Courses
                </Link>
                <Link to="/courses" style={linkStyle}>
                  View All
                </Link>
              </>
            )}

            {/* Admin*/}
            {role === "admin" && (
              <>
                <Link to="/admindashboard" style={linkStyle}>
                  Admin Dashboard
                </Link>
                <Link to="/manage-users" style={linkStyle}>
                  Manage Users
                </Link>
              </>
            )}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid white",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>

            <Link to="/profile" style={{
              ...linkStyle,
              padding: '4px 10px',
              borderRadius: '100%',
              background: '#fff',
              color: '#0078ff',
              fontSize: '19px',
              lineHeight: '28px',
              marginLeft: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #0078ff'
            }} title="Profile">
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M20 20c0-3.3-2.7-6-6-6s-6 2.7-6 6"/></svg>
            </Link>

          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
