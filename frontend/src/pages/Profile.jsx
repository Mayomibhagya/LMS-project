import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPW, setEditPW] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchEnrollments();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
      setError("Could not fetch user info.");
    }
  };

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/enrollments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrollments(res.data);
    } catch {}
  };

  const handleEdit = () => {
    setEditName(user?.name||'');
    setEditPW("");
    setOk("");
    setError("");
    setEdit(true);
  };
  const handleCancel = () => {
    setEdit(false);
    setOk("");
    setError("");
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setOk("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const data = {};
      if (editName && editName !== user?.name) data.name = editName;
      if (editPW) data.password = editPW;
      if (!data.name && !data.password) { setOk(""); setError("Nothing to update"); setSaving(false); return; }
      const res = await axios.put("http://localhost:5000/api/auth/me", data, { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
      setEdit(false);
      setOk("Profile updated!");
    } catch {
      setError("Could not update profile");
    }
    setSaving(false);
  };
  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      {error && <p className="profile-error">{error}</p>}
      {ok && <p className="profile-ok">{ok}</p>}
      {user && (
        <div className="profile-box">
          <div><b>Name:</b> {user.name}</div>
          <div><b>Email:</b> {user.email}</div>
          <div><b>Role:</b> {user.role}</div>
          {!edit && <button className="edit-btn" onClick={handleEdit}>Edit</button>}
          {edit && (
            <form className="edit-form" onSubmit={handleSave}>
              <input value={editName} className="edit-input" onChange={e=>setEditName(e.target.value)} placeholder="Name" />
              <input value={editPW} className="edit-input" onChange={e=>setEditPW(e.target.value)} placeholder="New password (optional)" type="password" />
              <button className="edit-btn" type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
              <button className="edit-btn cancel" type="button" onClick={handleCancel}>Cancel</button>
            </form>
          )}
        </div>
      )}
      <h3 className="profile-enroll-title">My Enrollments</h3>
      <div className="profile-enroll-list">
        {enrollments.length === 0 ? (
          <div className="profile-enroll-empty">No enrollments found.</div>
        ) : enrollments.map(e => (
          <div className="profile-enroll-card" key={e._id}>
            <div><b>Course:</b> {e.course?.title || '-'}</div>
            <div><b>Category:</b> {e.course?.category || '-'}</div>
            <div><b>Payment:</b> {e.paymentStatus}</div>
            <div><b>Status:</b> {e.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Profile;
