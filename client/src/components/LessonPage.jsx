import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { toast } from "react-toastify";
import "../styles/lessonPage.css";

export default function LessonPage() {
    const { user, token } = useUser();
    const { id } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        if (!user || !token) {
            setError("אין לך הרשאה לצפות בפרטי שיעור. יש להתחבר.");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:5000/lessons/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
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
    }, [id, user, token]);

    const handleRegister = () => {
        if (!user || user.role !== "student") {
            toast.error(
                <div>
                    עליך להתחבר כתלמיד כדי להירשם לשיעור. <br />
                    <Link to="/login" style={{ color: '#61dafb', textDecoration: 'underline' }}>
                        להתחברות
                    </Link>
                </div>,
                { autoClose: 5000 }
            );
            return;
        }

        const body = {
            sender_id: user.user_id,
            receiver_id: lesson.teacher_id,
            content: `בקשה להירשם לשיעור "${lesson.title}"`,
            is_request: true,
            lesson_id: lesson.id
        };

        fetch("http://localhost:5000/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body),
        })
            .then(res => {
                if (!res.ok) throw new Error("שגיאה בשליחת בקשה למורה");
                return res.json();
            })
            .then(() => {
                toast.success("הבקשה נשלחה למורה בהצלחה!");
                setRegistered(true);
            })
            .catch((err) => {
                toast.error("אירעה שגיאה: " + err.message);
            });
    };

    if (loading) return <p className="loading">טוען...</p>;

    if (error) return (
        <div className="lesson-page-container">
            <p className="error">⚠️ {error}</p>
            {!user && (
                <Link to="/login" style={{ color: '#61dafb', textDecoration: 'underline' }}>
                    התחבר כאן
                </Link>
            )}
        </div>
    );

    if (!lesson) return <p className="not-found">לא נמצא שיעור</p>;

    return (
        <div className="lesson-page-container">
            <h1 className="lesson-page-title">{lesson.title}</h1>
            <p><strong>נושא:</strong> {lesson.subject}</p>
            <p><strong>מס' יחידות:</strong> {lesson.level}</p>
            <p><strong>מורה:</strong> {lesson.teacher}</p>
            <p><strong>סטטוס:</strong> {lesson.status}</p>
            <p><strong>מיקום:</strong> {lesson.location}</p>
            <p><strong>מועדים:</strong> {new Date(lesson.start_date).toLocaleDateString()} - {new Date(lesson.end_date).toLocaleDateString()}</p>
            {/* <p><strong>לוח זמנים:</strong> {lesson.schedule}</p> */}
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