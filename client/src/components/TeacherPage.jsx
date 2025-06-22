import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { canViewTeacherDetails } from '../helpers/authHelpers';
import '../styles/lessonPage.css';

export default function TeacherPage() {
    const { user } = useUser();
    const { id } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userLoaded = user !== undefined; // נוודא אם user נטען

    useEffect(() => {
        if (!userLoaded) return;

        // אם אין הרשאה - נציג הודעה
        if (!canViewTeacherDetails(user)) {
            setError(!user ? "יש להתחבר כדי לצפות בפרטי המורה." : "אין לך הרשאה לצפות בפרטי המורה.");
            setLoading(false);
            return;
        }

        // טען את פרטי המורה
        fetch(`http://localhost:5000/teachers/${id}`, {
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("שגיאה בטעינת פרטי המורה");
                return res.json();
            })
            .then(data => {
                setTeacher(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id, userLoaded, user]);

    // כל עוד המשתמש לא נטען – נמתין
    if (!userLoaded) return <p className="loading">טוען פרטי משתמש...</p>;

    if (loading) return <p className="loading">טוען...</p>;

    if (error) {
        return (
            <div className="lesson-page-container">
                <p className="error">⚠️ {error}</p>
                {!user && (
                    <Link to="/login" style={{ color: '#61dafb', textDecoration: 'underline' }}>
                        התחבר כאן
                    </Link>
                )}
            </div>
        );
    }

    if (!teacher) return <p className="not-found">לא נמצא מורה</p>;

    return (
        <div className="lesson-page-container">
            <h1 className="lesson-page-title">{teacher.user_name}</h1>
            <p><strong>אימייל:</strong> {teacher.email}</p>
            <p><strong>טלפון:</strong> {teacher.phone_number || 'לא זמין'}</p>
            <p><strong>תפקיד:</strong> {teacher.role}</p>
        </div>
    );
}
