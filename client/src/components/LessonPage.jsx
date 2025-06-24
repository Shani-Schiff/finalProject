import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { canViewDetails } from '../helpers/authHelpers';
import { toast } from "react-toastify";
import "../styles/lessonPage.css";

export default function LessonPage() {
    const { user } = useUser();
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        if (!canViewDetails(user)) {
            setError("אין לך הרשאה לצפות בפרטי שיעור. יש להתחבר עם משתמש מתאים.");
            setLoading(false);
            return;
        }

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
    }, [id, user]);

    const handleRegister = () => {
        // if (!canRegisterToLesson(user)) {
        //     toast.error(
        //         <div>
        //             עליך להתחבר כלקוח (תלמיד) כדי להירשם לשיעור. <br />
        //             <Link to="/login" style={{ color: '#61dafb', textDecoration: 'underline' }}>
        //                 להתחברות
        //             </Link>
        //         </div>,
        //         { autoClose: 3000 }
        //     );
        //     return;
        // } else {
        const body = {
            sender_id: user.user_id,
            receiver_id: lesson.teacher_id,
            content: JSON.stringify(lesson),
            is_request: true,
            lesson_id: lesson.id // 👈 כאן הדגש
        };
        fetch("http://localhost:5000/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("שגיאה בטעינת השיעור");
                }
                return res.json();
            })
            .then((data) => {
                setLesson(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }

    if (loading) return <p className="loading">טוען...</p>;
    if (error) return (
        <div className="lesson-page-container">
            <p className="error">⚠️ {error}</p>
            {!user && <Link to="/login" style={{ color: '#61dafb', textDecoration: 'underline' }}>התחבר כאן</Link>}
        </div>
    );
    if (!lesson) return <p className="not-found">לא נמצא שיעור</p>;

    return (
        <div className="lesson-page-container">
            <h1 className="lesson-page-title">{lesson.title}</h1>
            <p><strong>נושא:</strong> {lesson.subject}</p>
            <p><strong>מס' יחידות:</strong> {lesson.level}</p>
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