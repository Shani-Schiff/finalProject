import { useEffect, useState } from 'react';
import '../../styles/personalArea.css';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('http://localhost:5000/users');
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("שגיאה בטעינת תלמידים", err);
      }
    }
    fetchStudents();
  }, []);

  return (
    <div className="personal-page">
      <h2>👥 ניהול תלמידים</h2>
      {students.length === 0 ? (
        <p>עדיין אין תלמידים</p>
      ) : (
        <ul className="simple-list">
          {students.map(s => (
            <li key={s.user_id}>{s.user_name} — {s.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
