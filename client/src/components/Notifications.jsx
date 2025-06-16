import { useEffect, useState } from "react";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/users/1/notifications') // המנהל = ID 1
            .then(res => res.json())
            .then(data => setNotifications(data))
            .catch(err => console.error('שגיאה בטעינת התראות:', err));
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>התראות מנהל</h2>
            <ul>
                {notifications.map(n => (
                    <li key={n.id}>
                        <strong>{new Date(n.created_at).toLocaleString()}:</strong> {n.content}
                    </li>
                ))}
            </ul>
        </div>
    );
}
