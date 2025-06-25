import { useState } from 'react';
import { useUser } from "../UserContext";
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
  const { user } = useUser();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null) body.append(k, v);
    });
    try {
      const res = await fetch("http://localhost:5000/apply-teacher", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        body
      });
      if (!res.ok) throw new Error("שגיאה בשליחת הבקשה");
      alert("✅ בקשתך נשלחה בהצלחה!");
    } catch (err) {
      console.error(err);
      alert("❌ קרתה שגיאה, נסי שוב מאוחר יותר");
    }
  };

  return (
    <div className="teacher-form-container">
      <h2>הגשת מועמדות למורה</h2>
      <form onSubmit={handleSubmit} className="teacher-form">
        <input name="full_name" placeholder="שם מלא" onChange={handleChange} required />
        <input name="email" type="email" placeholder="אימייל" onChange={handleChange} required />
        <input name="phone" type="tel" placeholder="טלפון" onChange={handleChange} required />
        <input name="subjects" placeholder="מקצועות (מופרדים בפסיקים)" onChange={handleChange} required />
        <textarea name="description" placeholder="ספר על עצמך..." onChange={handleChange} required />
        <textarea name="experience" placeholder="ניסיון קודם..." onChange={handleChange} required />
        <input name="location" placeholder="איזור מגורים" onChange={handleChange} required />
        <label>תמונת פרופיל:</label>
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <label>קובץ קו"ח:</label>
        <input type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleChange} />
        <button type="submit">שלח בקשה</button>
      </form>
    </div>
);
}
