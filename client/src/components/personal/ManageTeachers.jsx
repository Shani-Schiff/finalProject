import { useEffect, useState } from "react";
import '../../styles/personalArea.css';

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const res = await fetch("http://localhost:5000/teachers");
        const data = await res.json();
        setTeachers(Array.isArray(data) ? data : []);
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
            <th>תפקיד/מקצועות</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(t => (
            <tr key={t.user_id}>
              <td>{t.user_name}</td>
              <td>{t.email}</td>
              <td>{t.subjects?.join?.(", ") || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
