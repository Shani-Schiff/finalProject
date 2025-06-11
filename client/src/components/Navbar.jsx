import '../styles/navbar.css';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">🧠 לומדים יחד</div>
      <ul className="nav-links">
        <li><Link to="/">דף הבית</Link></li>
        <li><Link to="/lessons">שיעורים</Link></li>
        <li><Link to="/teachers">מורים</Link></li>
        <li><Link to="/faq">שאלות נפוצות</Link></li>
        <li><Link to="/contact">צור קשר</Link></li>
        <li><Link to="/login">כניסה / הרשמה</Link></li>
      </ul>
    </nav>
  );
}
