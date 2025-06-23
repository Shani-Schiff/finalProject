import { useState } from 'react';
import '../../styles/personalArea.css';

export default function CreateLesson() {
  const [form, setForm] = useState({ title:'', subject:'', level:'', schedule:'', price:'', location:'' });

  const handleSubmit = e => {
    e.preventDefault();
    // שלחי ל‑API יצירת שיעור
    console.log('create lesson', form);
  };

  return (
    <div className="personal-page form-page">
      <h2>➕ יצירת שיעור חדש</h2>
      <form onSubmit={handleSubmit}>
        {['title','subject','level','schedule','price','location'].map(key => (
          <div key={key} className="form-group">
            <label>{key === 'title'? 'כותרת' :
                     key==='subject'? 'נושא' :
                     key==='level'? 'רמה' :
                     key==='schedule'? 'תזמון' :
                     key==='price'? 'מחיר' :
                     'מיקום'}</label>
            <input
              type={key === 'price' ? 'number' : 'text'}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              required
            />
          </div>
        ))}
        <button type="submit" className="primary-btn">צור שיעור</button>
      </form>
    </div>
  );
}
