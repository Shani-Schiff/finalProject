import { useEffect, useState, useRef } from "react";
import '../styles/notifications.css';
import { useUser } from './UserContext';
import { isLoggedIn } from '../helpers/authHelpers';

export default function Notifications() {
  const { user } = useUser();
  const currentUserId = user?.user_id;

  const [conversations, setConversations] = useState([]); // שיחות קיימות
  const [allUsers, setAllUsers] = useState([]); // כל המשתמשים באתר
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // גלילה אוטומטית לתחתית הודעות כשמתעדכנות
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // טען שיחות קיימות
  useEffect(() => {
    if (currentUserId && user?.token) {
      fetch(`http://localhost:5000/messages/conversations/${currentUserId}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) setConversations(data);
          else setConversations([]);
        })
        .catch(err => {
          console.error(err);
          setError("שגיאה בטעינת שיחות");
        });
    }
  }, [currentUserId, user?.token]);

  // טען את כל המשתמשים באתר (ליצירת שיחות חדשות)
  useEffect(() => {
    if (user?.token) {
      fetch('http://localhost:5000/users', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then(users => setAllUsers(users.filter(u => u.user_id !== currentUserId)))
        .catch(err => {
          console.error(err);
          setError("שגיאה בטעינת משתמשים");
        });
    }
  }, [currentUserId, user?.token]);

  // טען הודעות לשיחה שנבחרה
  useEffect(() => {
    if (!selectedUser || !currentUserId) {
      setMessages([]);
      return;
    }
    fetch(`http://localhost:5000/messages/${currentUserId}/${selectedUser.user_id}`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(setMessages)
      .catch(err => {
        console.error(err);
        setError("שגיאה בטעינת הודעות");
      });
  }, [selectedUser, currentUserId, user?.token]);

  // התחלת שיחה חדשה או מעבר לשיחה קיימת
  const startConversation = (otherUser) => {
    // בדיקה אם השיחה כבר קיימת
    const existing = conversations.find(c => c.user_id === otherUser.user_id);
    if (existing) {
      setSelectedUser(existing);
    } else {
      // הוספה לרשימת שיחות זמנית + בחירה
      setConversations(prev => [...prev, otherUser]);
      setSelectedUser(otherUser);
      setMessages([]); // אין הודעות עדיין
    }
  };

  // שליחת הודעה
  const sendMessage = () => {
    if (!selectedUser || !newMessage.trim() || !currentUserId) return;

    fetch('http://localhost:5000/messages', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({
        sender_id: currentUserId,
        receiver_id: selectedUser.user_id,
        content: newMessage.trim()
      })
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(sent => {
        setMessages(prev => [...prev, sent]);
        setNewMessage("");
        // אם השיחה חדשה - ודא שהיא ברשימת השיחות
        if (!conversations.find(c => c.user_id === selectedUser.user_id)) {
          setConversations(prev => [...prev, selectedUser]);
        }
      })
      .catch(err => {
        console.error(err);
        setError("שגיאה בשליחת ההודעה");
      });
  };

  if (!isLoggedIn(user)) {
    return <p>יש להתחבר כדי לגשת להודעות</p>;
  }

  return (
    <div className="notifications-container">
      <h2>📬 תיבת ההודעות שלי</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="chat-layout">
        {/* רשימת שיחות קיימות */}
        <div className="user-list">
          <h4>שיחות אחרונות</h4>
          {conversations.length === 0 && <p>אין שיחות להצגה</p>}
          {conversations.map(u => (
            <div
              key={u.user_id}
              className={`user-item ${selectedUser?.user_id === u.user_id ? 'selected' : ''}`}
              onClick={() => setSelectedUser(u)}
            >
              <strong>{u.user_name}</strong><br />
              <small>{u.email}</small>
            </div>
          ))}
        </div>

        {/* רשימת כל המשתמשים להתחלת שיחה חדשה */}
        <div className="user-list" style={{ borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>
          <h4>התחל שיחה חדשה עם:</h4>
          {allUsers.length === 0 && <p>אין משתמשים זמינים</p>}
          {allUsers.map(u => (
            <div
              key={u.user_id}
              className="user-item"
              onClick={() => startConversation(u)}
              style={{ cursor: 'pointer' }}
            >
              {u.user_name} ({u.email})
            </div>
          ))}
        </div>

        {/* תיבת הצ'אט */}
        <div className="chat-box">
          {selectedUser ? (
            <>
              <h4>שיחה עם {selectedUser.user_name}</h4>
              <div className="messages" style={{ height: '350px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
                {messages.length === 0 && <p>אין הודעות בשיחה זו</p>}
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`message ${msg.sender_id === currentUserId ? 'me' : 'other'}`}
                    style={{
                      textAlign: msg.sender_id === currentUserId ? 'right' : 'left',
                      marginBottom: '8px'
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        backgroundColor: msg.sender_id === currentUserId ? '#DCF8C6' : '#FFF',
                        border: '1px solid #ddd',
                        maxWidth: '70%',
                        wordWrap: 'break-word'
                      }}
                    >
                      <strong>{msg.sender_id === currentUserId ? 'אני' : selectedUser.user_name}</strong>: {msg.content}
                      <div style={{ fontSize: '0.75em', color: '#555', marginTop: '4px' }}>
                        {new Date(msg.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <textarea
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="כתוב הודעה חדשה..."
                style={{ width: '100%', height: '70px', resize: 'none', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <button
                onClick={sendMessage}
                style={{
                  marginTop: '8px',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                שלח
              </button>
            </>
          ) : (
            <p>בחר שיחה מהרשימה או התחל שיחה חדשה</p>
          )}
        </div>
      </div>
    </div>
  );
}
