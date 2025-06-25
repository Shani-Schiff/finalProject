import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/lessons.css";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/subjects")
      .then(res => res.json())
      .then(data => setSubjects(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="subjects-page">
      <h2 className="subjects-title">📘 מקצועות הלימוד</h2>
      <ul className="subjects-list">
        {subjects.map(s => (
          <li key={s.id}>
            <Link to={`/subjects/${s.id}`}>{s.subject_name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
