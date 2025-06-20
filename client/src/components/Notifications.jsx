import { useEffect, useState } from "react";
import '../styles/notifications.css';


export default function Notifications() {
    const currentUserId = 1; // לדוגמה – המנהל
    const [messages, setMessages] = useState([]);
    const [receiverEmail, setReceiverEmail] = useState("");
    const [receiverId, setReceiverId] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState("");

    // טוען שיחה עם נמען
    useEffect(() => {
        if (!receiverId) return;
        fetch(`http://localhost:5000/messages/${currentUserId}/${receiverId}`)
            .then(res => res.json())
            .then(setMessages)
            .catch(console.error);
    }, [receiverId]);

    // ממיר אימייל ל־ID
    const fetchReceiverId = async () => {
        try {
            const res = await fetch(`http://localhost:5000/users`);
            const users = await res.json();
            const receiver = users.find(u => u.email === receiverEmail);
            if (receiver) {
                setReceiverId(receiver.userId);
                setError("");
            } else {
                setError("לא נמצא משתמש עם אימייל זה");
            }
        } catch {
            setError("שגיאה בקבלת נתוני המשתמשים");
        }
    };

    const sendMessage = () => {
        if (!receiverId || !newMessage) return;

        fetch('http://localhost:5000/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sender_id: currentUserId,
                receiver_id: receiverId,
                content: newMessage
            })
        })
        .then(res => res.json())
        .then(sent => {
            setMessages(prev => [...prev, sent]);
            setNewMessage("");
        })
        .catch(console.error);
    };

    return (
        <div className="notifications-container">
            <h2>📬 ההודעות שלי</h2>

            <div className="receiver-section">
                <label>👤 אימייל של מורה / תלמיד:</label>
                <input
                    type="email"
                    value={receiverEmail}
                    onChange={e => setReceiverEmail(e.target.value)}
                    placeholder="example@email.com"
                />
                <button onClick={fetchReceiverId}>הצג שיחה</button>
                {error && <div className="error-message">{error}</div>}
            </div>

            <div className="chat-box">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`message ${msg.sender_id === currentUserId ? 'me' : 'other'}`}
                    >
                        <div className="message-content">
                            <strong>{msg.sender_id === currentUserId ? "🟢 אני" : "🔵 משתמש " + msg.sender_id}:</strong>
                            <span> {msg.content}</span>
                        </div>
                        <div className="timestamp">
                            {new Date(msg.timestamp).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>

            <textarea
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="💬 הקלד הודעה חדשה..."
            />

            <button className="send-button" onClick={sendMessage}>
                שלח הודעה ✉️
            </button>
        </div>
    );
}
