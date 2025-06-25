import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/lessons.css";

export default function SubjectsLessons() {
  const { id } = useParams();
  const [lessons, setLessons] = useState([]);
  const [subject, setSubject] = useState("");

  useEffect(() => {
    // שליפת שם מקצוע
    fetch(`http://localhost:5000/subjects/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject("❌ שגיאה בטעינת מקצוע"))
      .then(data => setSubject(data.subject_name))
      .catch(err => console.error(err));

    // שליפת שיעורים כולל שם מורה
    fetch(`http://localhost:5000/subjects/${id}/lessons`)
      .then(res => res.ok ? res.json() : Promise.reject("❌ שגיאה בטעינת שיעורים"))
      .then(setLessons)
      .catch(err => {
        console.error(err);
        setLessons([]);
      });
  }, [id]);

  return (
    <div className="subject-lessons-container">
      <h2>📚 שיעורים במקצוע: {subject}</h2>
      <div className="lessons-grid">
        {lessons.length === 0 && <p>אין שיעורים זמינים</p>}
        {lessons.map(lesson => (
          <div className="lesson-card" key={lesson.id}>
            <h3>מורה: {lesson.teacher?.user_name || "לא זמין"}</h3>
            <p>מספר יחידות: {lesson.level ?? "לא צויין"}</p>
            <Link to={`/subjects/lessons/${lesson.id}`} className="details-button">לפרטים</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
