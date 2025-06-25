import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../components/UserContext";
import { canViewDetails } from '../helpers/authHelpers';
import '../styles/lessons.css';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    fetch('http://localhost:5000/teachers')
      .then(res => res.json())
      .then(data => setTeachers(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const handleRestrictedClick = e => {
    e.preventDefault();
    toast.info(
      <>
        יש להתחבר כדי לצפות בפרטים!<br />
        <Link to="/login" style={{ color: '#61dafb' }}>התחבר/הרשם</Link>
      </>,
      { autoClose: 5000 }
    );
  };

  return (
    <div className="lessons-container">
      <h2 className="lessons-title">📚 המורים שלנו</h2>
      {teachers.length === 0 ? (
        <p>לא נמצאו מורים</p>
      ) : (
        <div className="lessons-grid">
          {teachers.map(t => (
            <div className="lesson-card" key={t.user_id}>
              <h3>{t.user_name}</h3>
              {canViewDetails(user) ? (
                <Link to={`/teachers/${t.user_id}`} className="details-button">לפרטים</Link>
              ) : (
                <button onClick={handleRestrictedClick} className="details-button">לפרטים</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
