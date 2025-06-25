import { Link, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { isAdmin, isTeacher, isStudent } from "../helpers/authHelpers";
import "../styles/personalArea.css";

export default function PersonalArea() {
  const { pathname } = useLocation();
  const { user } = useUser();

  const role = user?.role;

  const links = [
    isStudent(user) && { to: "calendar", label: "📅 לוח שנה" },
    isStudent(user) && { to: "apply", label: "📝 הגשת מועמדות להוראה" },
    isStudent(user) && { to: "messages", label: "📩 ההודעות שלי" },

    isTeacher(user) && { to: "calendar", label: "📅 לוח שנה" },
    isTeacher(user) && { to: "apply", label: "📝 הגשת מועמדות להוראה" },
    isTeacher(user) && { to: "messages", label: "📩 ההודעות שלי" },
    isTeacher(user) && { to: "create-lesson", label: "🆕 יצירת שיעור" },

    isAdmin(user) && { to: "calendar", label: "📅 לוח שנה" },
    isAdmin(user) && { to: "messages", label: "📩 ההודעות שלי" },
    isAdmin(user) && { to: "create-lesson", label: "🆕 יצירת שיעור" },
    isAdmin(user) && { to: "manage-teachers", label: "👩‍🏫 ניהול מורים" },
  ].filter(Boolean);

  return (
    <div className="personal-area-container">
      <aside className="personal-area-sidebar">
        <h2>אזור אישי</h2>
        <ul>
          {links.map(link => (
            <li key={link.to} className={pathname.includes(link.to) ? "active" : ""}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <div className="personal-area-separator" />
      <main className="personal-area-content">
        <Outlet />
      </main>
    </div>
  );
}
