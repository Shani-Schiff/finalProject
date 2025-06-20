import { useEffect, useState } from "react";
import '../styles/lessons.css';

export default function Teachers() {
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/teachers')
            .then(response => response.json())
            .then(data => setLessons(data))
            .catch(err => console.error('שגיאה בטעינת המורים:', err));
    }, []);

    return (
        <div className="lessons-container">
            <h2 className="lessons-title">📚 המורים שלנו </h2>

            {lessons.length === 0 ? (
                <p className="no-lessons">לא נמצאו מורים</p>
            ) : (
                <div className="lessons-grid">
                    {lessons.map(teacher => (
                        <div className="lesson-card" key={teacher.userId}>
                            <h3 className="lesson-title">{teacher.userName}</h3>
                            <button className="details-button">לפרטים</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
