import { useState } from 'react';
import { useUser } from "../UserContext";

import '../styles/ApplyTeacher.css';

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
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = () => {
    const body = {
      sender_id: user.user_id,
      receiver_id: 1,
      content: JSON.stringify(formData),
      is_request: true,
    };

    fetch("http://localhost:5000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("שגיאה בטעינת השיעור");
        }
        return res.json();
      })
      .then((data) => {
        setLesson(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      })

  };

  return (
    <div className="teacher-form-container">
      <h2>הגשת מועמדות למורה</h2>
      <form onSubmit={handleSubmit} className="teacher-form">
        <input name="full_name" placeholder="שם מלא" onChange={handleChange} required />
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

        <button type="submit" >שלח בקשה</button>
      </form>
    </div>
  );
}
