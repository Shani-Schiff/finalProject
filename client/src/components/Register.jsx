import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "./UserContext";
import "react-toastify/dist/ReactToastify.css";
import "../styles/auth.css";

export default function Register() {
  const { setUser } = useUser();

  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    phone_number: "",
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
        setUser({
          user_id: data.user.user_id,
          user_name: data.user.user_name,
          email: data.user.email,
          phone_number: data.user.phone_number,
          role: data.user.role,
          token: data.token
        });



        toast.success("נרשמת בהצלחה! 🎉", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
        setTimeout(() => navigate("/"), 3000);
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
          value={formData.user_name}
          onChange={(e) =>
            setFormData({ ...formData, user_name: e.target.value })
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
          value={formData.phone_number}
          onChange={(e) =>
            setFormData({ ...formData, phone_number: e.target.value })
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