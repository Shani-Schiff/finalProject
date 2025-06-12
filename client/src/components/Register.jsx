import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/auth.css";

export default function Register() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "שגיאה בהרשמה ❌", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      } else {
        toast.success("נרשמת בהצלחה! 🎉", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
        setTimeout(() => navigate("/"), 3000); // מעבר אחרי 3 שניות
      }
    } catch (err) {
      toast.error("קרתה שגיאה בשרת, נסה שוב מאוחר יותר", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>הרשמה</h2>
        <input
          type="text"
          placeholder="שם מלא"
          value={formData.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="טלפון"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <button type="submit">הירשם</button>
        <p className="toggle-text">
          כבר רשומים? <Link to="/login">להתחברות</Link>
        </p>
      </form>
    </div>
  );
}
