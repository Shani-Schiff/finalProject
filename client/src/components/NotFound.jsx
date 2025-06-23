import { useNavigate } from 'react-router-dom';
import '../styles/notFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-box">
        <h1>404</h1>
        <p>אופס! הדף שביקשת לא נמצא... 😢</p>
        <div className="not-found-buttons">
          <button onClick={() => navigate(-1)}>➡️ חזרה לדף הקודם</button>
          <button onClick={() => navigate('/')}>🏠 חזרה לדף הבית</button>
        </div>
      </div>
    </div>
  );
}
