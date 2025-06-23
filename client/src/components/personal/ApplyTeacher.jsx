import { useState } from 'react';
import '../../styles/personalArea.css';

export default function ApplyTeacher() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subjects: '',
    description: '',
    experience: '',
    location: '',
    image: null,
    cv: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    for (const key in formData) {
      body.append(key, formData[key]);
    }

    try {
      const res = await fetch('http://localhost:5000/apply-teacher', {
        method: 'POST',
        body
      });
      const result = await res.json();
      alert(result.message);
    } catch (err) {
      alert('שגיאה בשליחת הטופס');
    }
  };

  return (
    <div className="personal-page form-page">
      <h2>📝 הגשת מועמדות להוראה</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>שם מלא</label>
          <input name="full_name" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>אימייל</label>
          <input name="email" type="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>טלפון</label>
          <input name="phone" type="tel" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>מקצועות לימוד (מופרדים בפסיקים)</label>
          <input name="subjects" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>ספר על עצמך</label>
          <textarea name="description" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>ניסיון קודם בהוראה</label>
          <textarea name="experience" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>איזור מגורים</label>
          <input name="location" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>תמונת פרופיל:</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>קובץ קו"ח:</label>
          <input type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleChange} />
        </div>
        <button type="submit" className="primary-btn">📨 שלח בקשה</button>
      </form>
    </div>
  );
}
