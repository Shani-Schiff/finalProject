import { useEffect, useState } from "react";

export default function Lessons() {
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/lessons')
            .then(response => response.json())
            .then(data => setLessons(data))
            .catch(err => console.error('שגיאה בטעינת שיעורים:', err));
    }, []);

    return (
        <div>
            <h2>שיעורים</h2>
            {lessons.length === 0 ? (
                <p>לא נמצאו שיעורים</p>
            ) : (
                <ul>
                    {lessons.map(lesson => (
                        <li key={lesson.id}>{lesson.title}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
