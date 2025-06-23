import '../styles/navbar.css';
import logo from '../media/logo.png';
import { useUser } from "./UserContext";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isLoggedIn } from '../helpers/authHelpers';

export default function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const requireLogin = (e) => {
    if (!isLoggedIn(user)) {
      e.preventDefault();
      toast.info(
        <div>
          יש להתחבר כדי לגשת! <br />
          <Link to="/login" style={{ color: '#61dafb', textDecoration: 'underline' }}>
            להתחברות
          </Link>
        </div>,
        { autoClose: 3500 }
      );
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-section logo-section">
        <Link to="/">
          <img src={logo} alt="navbarLogoPicture" className="navbar-logo-picture" />
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">דף הבית</Link></li>

        <li>
          <Link
            to={isLoggedIn(user) ? "/personal" : "#"}
            onClick={requireLogin}
          >
            אזור אישי
          </Link>
        </li>

        <li><Link to="/subjects">שיעורים</Link></li>
        <li><Link to="/teachers">מורים</Link></li>
        <li><Link to="/questions">שאלות נפוצות</Link></li>
        <li><Link to="/contactUs">צור קשר</Link></li>
      </ul>

      <div className="navbar-section login-section">
        {!user ? (
          <Link to="/login" className="login-button">כניסה / הרשמה</Link>
        ) : (
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="logout-button"
          >
            התנתק
          </button>
        )}
      </div>
    </nav>
  );
}
