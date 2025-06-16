import '../styles/navbar.css';
import logo from '../media/logo.png';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-section logo-section">
        <Link to="/">
          <img src={logo} alt="navbarLogoPicture" className="navbar-logo-picture" />
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">דף הבית</Link></li>
        <li><Link to="/lessons">שיעורים</Link></li>
        <li><Link to="/teachers">מורים</Link></li>
        <li><Link to="/Notifications">ההודעות שלי</Link></li>
        <li><Link to="/questions">שאלות נפוצות</Link></li>
        <li><Link to="/contactUs">צור קשר</Link></li>
      </ul>

      <div className="navbar-section login-section">
        <Link to="/login" className="login-button">כניסה / הרשמה</Link>
      </div>
    </nav>
  );
}
