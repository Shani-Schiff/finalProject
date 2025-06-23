import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/lessons.css";

export default function SubjectsLessons() {
  const { id } = useParams();
  const [lessons, setLessons] = useState([]);
  const [subject, setSubject] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/subjects/${id}`)
      .then(res => res.json())
      .then(data => setSubject(data.subject_name));

    fetch(`http://localhost:5000/subjects/${id}/lessons`)
      .then(res => res.json())
      .then(setLessons);
  }, [id]);

  return (
    <div className="subject-lessons-container">
      <h2>📚 שיעורים במקצוע: {subject}</h2>
      <div className="lessons-grid">
        {lessons.map(lesson => (
          <div className="lesson-card" key={lesson.id}>
            <h3>{lesson.title}</h3>
            <Link to={`/subjects/lessons/${lesson.id}`}>
              לפרטים
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
