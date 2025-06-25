import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/personalArea.css';

export default function Calendar() {
  const { user, token } = useUser();
  const [lessons, setLessons] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) return;

    const url = user.role === 'teacher'
      ? `http://localhost:5000/teachers/${user.user_id}/lessons`
      : `http://localhost:5000/users/${user.user_id}/lessons`;

    axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.lessons || [];
        setLessons(data);
      })
      .catch(err => {
        console.error('שגיאה בטעינת שיעורים:', err.response?.data || err.message);
        if (err.response?.data?.redirectToLogin) {
          navigate('/login');
        }
        setLessons([]);
      });
  }, [user, token]);

  const getNextTwoWeeks = () => {
    const days = [];
    const firstDay = new Date(startDate);
    for (let i = 0; i < 14; i++) {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const filteredLessons = lessons.filter(lesson => {
    const lessonDate = new Date(lesson.start_date);
    return lessonDate >= startDate &&
      lessonDate < new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);
  });

  const nextWeek = () => {
    const next = new Date(startDate);
    next.setDate(next.getDate() + 14);
    setStartDate(next);
  };

  const prevWeek = () => {
    const prev = new Date(startDate);
    prev.setDate(prev.getDate() - 14);
    setStartDate(prev);
  };

  const days = getNextTwoWeeks();

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevWeek}>&larr;</button>
        <h2>מערכת שיעורים</h2>
        <button onClick={nextWeek}>&rarr;</button>
      </div>

      <div className="calendar-grid">
        {days.map(day => (
          <div key={day.toDateString()} className="calendar-day">
            <h4>{day.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' })}</h4>
            {filteredLessons
              .filter(lesson => new Date(lesson.start_date).toDateString() === day.toDateString())
              .map(lesson => (
                <div key={lesson.id} className="lesson-card">
                  <strong>{lesson.title}</strong><br />
                  מורה: {lesson.teacher?.user_name || lesson.teacher_name}<br />
                  {formatTime(lesson.start_date)} - {formatTime(lesson.end_date)}
                </div>
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
}
