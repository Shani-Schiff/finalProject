import { useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import '../../styles/personalArea.css';
import axios from 'axios';

export default function Calendar() {
  const { user } = useUser();
  const [lessons, setLessons] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
  if (!user) return;

  const fetchLessons = async () => {
    try {
      const url = user.role === 'teacher'
        ? `/api/teachers/${user.user_id}/lessons`
        : `/api/users/${user.user_id}/lessons`;

      const res = await axios.get(url);

      setLessons(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('שגיאה בשליפת שיעורים:', err);
      setLessons([]);
    }
  };

  fetchLessons();
}, [user]);

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
        <button onClick={prevWeek}>&rarr;</button>
        <h2>מערכת שיעורים</h2>
        <button onClick={nextWeek}>&larr;</button>
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
