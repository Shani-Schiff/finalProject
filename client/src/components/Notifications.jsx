import { useEffect, useState } from "react";
import '../styles/notifications.css';
import { useUser } from './UserContext';
import { isLoggedIn } from '../helpers/authHelpers';

export default function Notifications() {
    const { user } = useUser();
    const currentuser_id = user?.user_id;

    const [messages, setMessages] = useState([]);
    const [receiverEmail, setReceiverEmail] = useState("");
    const [receiverId, setReceiverId] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!receiverId || !currentuser_id) return;

        fetch(`http://localhost:5000/messages/${currentuser_id}/${receiverId}`)
            .then(res => res.json())
            .then(setMessages)
            .catch(console.error);
    }, [receiverId, currentuser_id]);

    const fetchReceiverId = async () => {
        try {
            const res = await fetch(`http://localhost:5000/users`);
            const users = await res.json();
            const receiver = users.find(u => u.email === receiverEmail);
            if (receiver) {
                setReceiverId(receiver.user_id);
                setError("");
            } else {
                setError("לא נמצא משתמש עם אימייל זה");
            }
        } catch {
            setError("שגיאה בקבלת נתוני המשתמשים");
        }
    };

    const sendMessage = () => {
        if (!receiverId || !newMessage || !currentuser_id) return;

        fetch('http://localhost:5000/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sender_id: currentuser_id,
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

    if (!isLoggedIn(user)) {
        return <p>יש להתחבר כדי לגשת להודעות</p>;
    }

    const handleRequest=(sender_id)=>{
        fetch('http://localhost:5000/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sender_id: receiverId,
                receiver_id: sender_id,
                content: 'בקשתך אושרה.'
            })
        })
            .then(res => res.json())
            .then(sent => {
                setMessages(prev => [...prev, sent]);
                setNewMessage("");
            })
            .catch(console.error);
    }

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
                        className={`message ${msg.sender_id === currentuser_id ? 'me' : 'other'}`}
                    >
                        <div className="message-content">
                            <strong>{msg.sender_id === currentuser_id ? "🟢 אני" : "🔵 משתמש " + msg.sender_id}:</strong>
                            <span> {msg.content}</span>
                        </div>
                        <div className="timestamp">
                            {new Date(msg.timestamp).toLocaleString()}
                        </div>
                        {msg.is_request && (
                            <button onClick={()=>handleRequest(msg.sender_id)} className="request-badge">אישור</button>   
                        )}
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
