import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';
import logo from '../media/logo.png';

const stats = [
    { label: 'תלמידים', value: 2600 },
    { label: 'שיעורים', value: 1200 },
    { label: 'מורים', value: 400 },
    { label: 'אחוזי שביעות רצון', value: 100}
];

function Counter({ target, trigger }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!trigger) return;

        let start = 0;
        const duration = 1000;
        const increment = target / (duration / 10);

        const interval = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(interval);
            } else {
                setCount(Math.floor(start));
            }
        }, 10);

        return () => clearInterval(interval);
    }, [target, trigger]);

    return <span>{count}</span>;
}

export default function Home() {
    const [triggerCounters, setTriggerCounters] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTriggerCounters(true);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="home-container">
            <div className="hero">
                <h1>ברוכים הבאים</h1>
                <img src={logo} alt="logoPicture" className="logo-picture" />
                <p>הדרך שלך להצלחה בבגרויות מתחילה כאן 💡<br />עם מורים מצוינים, שיעורים אונליין, והתאמה אישית לתלמידים מכל הרמות.</p>
                <div className="cta-buttons">
                    <Link to="/lessons">
                        <button className="primary">📚 צפה בשיעורים</button>
                    </Link>
                    <Link to="/register">
                        <button className="secondary">🚀 הירשם עכשיו</button>
                    </Link>
                </div>
            </div>

            <div className={`stats-container ${triggerCounters ? 'visible' : 'hidden'}`}>
                {stats.map((stat, i) => (
                    <div className="stat-box" key={i}>
                        <Counter target={stat.value} trigger={triggerCounters} />
                        <p>{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
