import '../styles/home.css';
// import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <section className="home-container">
            <h1>ברוכים הבאים ל"לומדים יחד"</h1>
            <p>פלטפורמה חכמה ללמידה לקראת בגרויות, עם מורים מעולים ושיעורים איכותיים!</p>
            <div className="cta-buttons">
                <button>צפה בשיעורים</button>
                <Link to="/register">
                    <button>הירשם עכשיו</button>
                </Link>
            </div>
        </section>
    )
}
