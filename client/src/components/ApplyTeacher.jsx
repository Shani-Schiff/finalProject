import { useState } from 'react';
import '../styles/ApplyTeacher.css';

export default function ApplyTeacher() {
  const [formData, setFormData] = useState({
    fullName: '',
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
    <div className="teacher-form-container">
      <h2>הגשת מועמדות למורה</h2>
      <form onSubmit={handleSubmit} className="teacher-form">
        <input name="fullName" placeholder="שם מלא" onChange={handleChange} required />
        <input name="email" type="email" placeholder="אימייל" onChange={handleChange} required />
        <input name="phone" type="tel" placeholder="מספר טלפון" onChange={handleChange} required />
        <input name="subjects" placeholder="מקצועות לימוד (מופרדים בפסיקים)" onChange={handleChange} required />
        <textarea name="description" placeholder="ספר על עצמך..." onChange={handleChange} required />
        <textarea name="experience" placeholder="ניסיון קודם בהוראה..." onChange={handleChange} required />
        <input name="location" placeholder="איזור מגורים" onChange={handleChange} required />
        
        <label>תמונת פרופיל:</label>
        <input type="file" name="image" accept="image/*" onChange={handleChange} />

        <label>קובץ קו"ח (PDF או Word):</label>
        <input type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleChange} />

        <button type="submit">שלח בקשה</button>
      </form>
    </div>
  );
}
