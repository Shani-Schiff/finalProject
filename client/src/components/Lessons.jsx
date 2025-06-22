import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { canViewDetails } from '../helpers/authHelpers';
import { toast } from "react-toastify";
import '../styles/lessons.css';

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    fetch('http://localhost:5000/lessons')
      .then(response => response.json())
      .then(data => setLessons(data))
      .catch(err => console.error('שגיאה בטעינת שיעורים:', err));
  }, []);

  const handleRestrictedClick = (e) => {
    e.preventDefault();
    toast.info(
      <div>
        יש להתחבר או להיות בעל הרשאה כדי לגשת לפרטי השיעור! <br />
        <Link to="/login" style={{ color: '#61dafb', textDecoration: 'underline' }}>
          להתחברות
        </Link>
      </div>,
      { autoClose: 3000 }
    );
  };

  return (
    <div className="lessons-container">
      <h2 className="lessons-title">📚 שיעורים זמינים</h2>

      {lessons.length === 0 ? (
        <p className="no-lessons">לא נמצאו שיעורים</p>
      ) : (
        <div className="lessons-grid">
          {lessons.map(lesson => (
            <div className="lesson-card" key={lesson.id}>
              <h3 className="lesson-title">{lesson.title}</h3>
              {canViewDetails(user) ? (
                <Link to={`/lessons/${lesson.id}`} className="details-button">לפרטים</Link>
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
