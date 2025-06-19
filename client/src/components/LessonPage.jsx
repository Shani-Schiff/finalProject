import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styles/lessonPage.css';

export default function LessonPage() {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/lessons/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("שגיאה בטעינת השיעור");
                return res.json();
            })
            .then(data => {
                setLesson(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleRegister = () => {
        // אפשרות ל־POST בעתיד
        setRegistered(true);
    };

    if (loading) return <p className="loading">טוען...</p>;
    if (error) return <p className="error">⚠️ {error}</p>;
    if (!lesson) return <p className="not-found">לא נמצא שיעור</p>;

    return (
        <div className="lesson-page-container">
            <h1 className="lesson-page-title">{lesson.title}</h1>
            <p><strong>נושא:</strong> {lesson.subject}</p>
            <p><strong>רמה:</strong> {lesson.level}</p>
            <p><strong>סטטוס:</strong> {lesson.status}</p>
            <p><strong>מיקום:</strong> {lesson.location}</p>
            <p><strong>מועדים:</strong> {new Date(lesson.start_date).toLocaleDateString()} - {new Date(lesson.end_date).toLocaleDateString()}</p>
            <p><strong>לוח זמנים:</strong> {lesson.schedule}</p>
            <p><strong>מספר משתתפים מקסימלי:</strong> {lesson.max_participants}</p>
            <p><strong>מחיר:</strong> ₪{lesson.price}</p>

            {!registered ? (
                <button className="signup-button" onClick={handleRegister}>הירשם לשיעור</button>
            ) : (
                <p className="success-message">✅ נרשמת בהצלחה!</p>
            )}
        </div>
    );
}
