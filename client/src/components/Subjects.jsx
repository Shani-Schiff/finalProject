import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/lessons.css";

export default function Subjects() {
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/subjects")
            .then(res => res.json())
            .then(setSubjects)
            .catch(err => console.error("שגיאה בטעינת מקצועות:", err));
    }, []);

    return (
        <div className="subjects-page">
            <h2 className="subjects-title">📘 מקצועות הלימוד</h2>
            <ul className="subjects-list">
                {subjects.map(subject => (
                    <li key={subject.id}>
                        <Link to={`/subjects/${subject.id}`}>
                            {subject.subject_name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
