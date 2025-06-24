import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/personalArea.css';
import { useUser } from '../UserContext';

export default function CreateLesson() {
  const { user } = useUser();
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    title: '',
    subject_id: '',
    level: '',
    max_participants: '',
    start_date: '',
    end_date: '',
    price: '',
    schedule: '',
    location: '',
    number_per_week: '',
  });

  useEffect(() => {
    axios.get('http://localhost:5000/subjects')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setSubjects(data || []);
      })
      .catch(err => {
        console.error('שגיאה בטעינת מקצועות:', err);
        alert('אירעה שגיאה בטעינת רשימת המקצועות');
      });
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log('Submitting form:', form);
    try {
      const body = {
        title: form.title,
        subject_id: form.subject_id,
        level: form.level,
        teacher_id: user.user_id,
        start_date: new Date(form.start_date),
        end_date: new Date(form.end_date),
        max_participants: Number(form.max_participants),
        price: Number(form.price),
        location: form.location,
        status: 'open',
      };

      await axios.post('http://localhost:5000/lessons', body);

      alert('✅ השיעור נוצר בהצלחה!');
    } catch (err) {
      console.error('❌ שגיאה ביצירת שיעור:', err);
      alert('אירעה שגיאה ביצירת השיעור.');
    }
  };

  return (
    <div className="personal-page form-page">
      <h2>➕ יצירת שיעור חדש</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>קטגוריית שיעור</label>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>מקצוע</label>
          <select name="subject_id" value={form.subject_id} onChange={handleChange} required>
            <option value="">בחר מקצוע</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.subject_name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>נושא השיעור</label>
          <input name="schedule" value={form.schedule} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>רמה / מס' יחידות</label>
          <input name="level" value={form.level} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>מספר משתתפים מקסימלי</label>
          <input name="max_participants" type="number" value={form.max_participants} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>שעת התחלה</label>
          <input name="start_date" type="datetime-local" value={form.start_date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>שעת סיום</label>
          <input name="end_date" type="datetime-local" value={form.end_date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>מחיר</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>מספר שיעורים בשבוע</label>
          <input name="number_per_week" type="number" value={form.number_per_week} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>מיקום</label>
          <input name="location" value={form.location} onChange={handleChange} required />
        </div>

        <button type="submit" className="primary-btn">צור שיעור</button>
      </form>
    </div>
  );
}