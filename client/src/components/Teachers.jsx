import { useEffect, useState } from "react";
import { useUser } from "../components/UserContext";
import { canViewTeacherDetails } from '../helpers/authHelpers';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import '../styles/lessons.css';

export default function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        fetch('http://localhost:5000/teachers')
            .then(response => response.json())
            .then(data => setTeachers(data))
            .catch(err => console.error('שגיאה בטעינת המורים:', err));
    }, []);

    const handleRestrictedClick = (e) => {
        e.preventDefault();
        toast.info(
            <div>
                יש להתחבר או להיות בעל הרשאה כדי לצפות בפרטי המורה! <br />
                <Link to="/login" style={{ color: '#61dafb', textDecoration: 'underline' }}>
                    להתחברות
                </Link>
            </div>,
            { autoClose: 3000 }
        );
    };

    return (
        <div className="lessons-container">
            <h2 className="lessons-title">📚 המורים שלנו </h2>

            {teachers.length === 0 ? (
                <p className="no-lessons">לא נמצאו מורים</p>
            ) : (
                <div className="lessons-grid">
                    {teachers.map(teacher => (
                        <div className="lesson-card" key={teacher.user_id}>
                            <h3 className="lesson-title">{teacher.user_name}</h3>
                            {canViewTeacherDetails(user) ? (
                                <Link to={`/teachers/${teacher.user_id}`} className="details-button">לפרטים</Link>
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
