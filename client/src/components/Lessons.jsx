import { useEffect, useState } from "react";
import '../styles/lessons.css';

export default function Lessons() {
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/lessons')
            .then(response => response.json())
            .then(data => setLessons(data))
            .catch(err => console.error('שגיאה בטעינת שיעורים:', err));
    }, []);

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
                            <button className="details-button">לפרטים</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
