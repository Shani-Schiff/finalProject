import { useEffect, useState } from "react";
import "../../styles/personalArea.css";

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const res = await fetch("http://localhost:5000/teachers-with-lessons");
        const data = await res.json();
        setTeachers(data);
      } catch (err) {
        console.error("שגיאה בטעינת מורים", err);
      }
    }
    fetchTeachers();
  }, []);

  return (
    <div className="personal-page">
      <h2>ניהול מורים</h2>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>שם מורה</th>
            <th>מייל</th>
            <th>שיעורים שהוא מלמד</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.email}</td>
              <td>{t.subjects?.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
