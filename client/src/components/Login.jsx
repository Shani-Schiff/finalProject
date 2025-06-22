import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "./UserContext";
import "../styles/auth.css";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        const userData = {
          user_id: data.user_id,
          user_name: data.user_name,
          email: data.email,
          phone_number: data.phone_number,
          role: data.role,
          token: data.token
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", data.token);
        setUser(userData);
        if (onLogin) onLogin(data);
        navigate("/");
      } else {
        toast.error(data.message || "שגיאה בהתחברות", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error("שגיאה בשרת. נסה שוב מאוחר יותר.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>התחברות</h2>
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
          type="password"
          placeholder="סיסמה"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <button type="submit">התחבר</button>
        <p className="toggle-text">
          עדיין לא רשומים? <Link to="/register">להרשמה</Link>
        </p>
      </form>
    </div>
  );
}
