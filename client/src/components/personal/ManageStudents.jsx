import { useEffect, useState } from 'react';
import '../../styles/personalArea.css';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // fetch('http://…/students') → setStudents(data)
  }, []);

  return (
    <div className="personal-page">
      <h2>👥 ניהול תלמידים</h2>
      {students.length === 0 ? <p>עדיין אין תלמידים</p> : (
        <ul className="simple-list">
          {students.map(s => <li key={s.user_id}>{s.user_name} — {s.email}</li>)}
        </ul>
      )}
    </div>
  );
}
