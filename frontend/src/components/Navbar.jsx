// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import userImg from "../assets/user.png";


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
              <Link to="/" style={linkStyle}>
                  Home
                </Link>

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
                  Add Courses
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
                <Link to="/managecourses" style={linkStyle}>
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

            <Link to="/profile"
  style={{
    ...linkStyle,
    padding: "4px",
    borderRadius: "50%",
    background: "#fff",
    marginLeft: "6px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1.5px solid #0078ff",
    width: "22px",
    height: "22px"
  }}
  title="Profile"
>
  <img 
    src={userImg} 
    alt="Profile"
    style={{
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      objectFit: "cover"
    }}
  />
            </Link>

          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
