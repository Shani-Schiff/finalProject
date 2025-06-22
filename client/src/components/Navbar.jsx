import '../styles/navbar.css';
import logo from '../media/logo.png';
import { useUser } from "./UserContext";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isLoggedIn, isTeacher, isStudent, canCreateLesson, canManageTeachers, canAccessMessages } from '../helpers/authHelpers';

export default function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const requireLogin = (e, path) => {
    if (!isLoggedIn(user)) {
      e.preventDefault();
      toast.info(
        <div>
          יש להתחבר כדי לגשת! <br />
          <Link to="/login" style={{ color: '#61dafb', textDecoration: 'underline' }}>
            להתחברות
          </Link>
        </div>,
        { autoClose: 3000 }
      );
      return;
    }

    // בדיקת הרשאות לפי קישור
    if (
      (path === "/admin/dashboard" && !canManageTeachers(user)) ||
      (path === "/my-lessons" && !isTeacher(user)) ||
      (path === "/create-lesson" && !canCreateLesson(user)) ||
      (path === "/my-schedule" && !isStudent(user)) ||
      (path === "/notifications" && !canAccessMessages(user))
    ) {
      e.preventDefault();
      toast.error("אין לך הרשאה לגשת לעמוד זה", { autoClose: 3000 });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-section logo-section">
        <Link to="/"><img src={logo} alt="navbarLogoPicture" className="navbar-logo-picture" /></Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">דף הבית</Link></li>
        <li><Link to="/lessons">שיעורים</Link></li>
        <li><Link to="/teachers">מורים</Link></li>
        <li><Link to="/questions">שאלות נפוצות</Link></li>
        <li><Link to="/contactUs">צור קשר</Link></li>

        {/* קישורים עם הרשאות */}
        <li><Link to="/my-lessons" onClick={e => requireLogin(e, "/my-lessons")}>השיעורים שלי</Link></li>
        <li><Link to="/create-lesson" onClick={e => requireLogin(e, "/create-lesson")}>יצירת שיעור</Link></li>
        <li><Link to="/my-schedule" onClick={e => requireLogin(e, "/my-schedule")}>המערכת שלי</Link></li>
        <li><Link to="/admin/dashboard" onClick={e => requireLogin(e, "/admin/dashboard")}>ניהול</Link></li>
        <li><Link to="/apply" onClick={e => requireLogin(e, "/apply")}>הגש מועמדות להוראה</Link></li>
        <li><Link to="/notifications" onClick={e => requireLogin(e, "/notifications")}>ההודעות שלי</Link></li>
      </ul>

      <div className="navbar-section login-section">
        {!user ? (
          <Link to="/login" className="login-button">כניסה / הרשמה</Link>
        ) : (
          <button onClick={() => { logout(); navigate('/'); }} className="logout-button">התנתק</button>
        )}
      </div>
    </nav>
  );
}
