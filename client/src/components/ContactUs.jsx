import { useState } from 'react';
import '../styles/contactUs.css';

export default function ContactUs() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (status) setStatus('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            setStatus(result.message);
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            console.error('שגיאה בשליחת הטופס:', err);
            setStatus('אירעה שגיאה בשליחה');
        }
    };

    return (
        <div className="contact-container fade-in">
            <h2 className="contact-title">📬 מוזמנים ליצור איתנו קשר!</h2>
            <form onSubmit={handleSubmit} className="contact-form">
                <input
                    name="name"
                    placeholder="שם מלא"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="אימייל"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="message"
                    placeholder="הודעה"
                    value={formData.message}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="submit-button">שליחה</button>
                {status && <p className="status-message">{status}</p>}
            </form>
        </div>
    );
}
