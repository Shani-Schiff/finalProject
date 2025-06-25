import { useEffect, useState, useRef } from "react";
import '../styles/messages.css';
import { useUser } from './UserContext';
import { isLoggedIn } from '../helpers/authHelpers';

export default function Messages() {
  const { user } = useUser();
  const currentUserId = user?.user_id;

  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const startConversation = (otherUser) => {
    const existing = conversations.find(c => c.user_id === otherUser.user_id);
    if (existing) {
      setSelectedUser(existing);
    } else {
      setConversations(prev => [...prev, otherUser]);
      setSelectedUser(otherUser);
      setMessages([]);
    }
  };

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
        if (!conversations.find(c => c.user_id === selectedUser.user_id)) {
          setConversations(prev => [...prev, selectedUser]);
        }
      })
      .catch(err => {
        console.error(err);
        setError("שגיאה בשליחת ההודעה");
      });
  };

  // פונקציה לאישור מועמדות (כבר קיימת אצלך, משאירה כאן)
  const handleRequest = async (sender_id, lesson_id) => {
    if (!user || !user.role) {
      console.error("User role not available");
      return;
    }

    let content;
    if (user.role === "admin") {
      content = "אישור המנהל התקבל. התפקיד שלך שונה למורה.";
    } else if (user.role === "teacher") {
      content = "אישור המורה התקבל.";
    } else {
      console.warn("למשתמש אין הרשאות לאשר");
      return;
    }

    try {
      if (user.role === "admin") {
        const roleResponse = await fetch(`http://localhost:5000/users/${sender_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({ role: "teacher" })
        });
        if (!roleResponse.ok) {
          console.error("שגיאה בעדכון התפקיד");
          return;
        }
      }
      if (user.role === "teacher" && lesson_id) {
        const registerResponse = await fetch(`http://localhost:5000/lessons/${lesson_id}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({ user_id: sender_id, status: "registered" })
        });
        if (!registerResponse.ok) {
          console.error("שגיאה בהרשמה לשיעור");
          return;
        }
      }

      const messageResponse = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          sender_id: currentUserId,
          receiver_id: sender_id,
          content
        })
      });
      const sent = await messageResponse.json();
      setMessages(prev => [...prev, sent]);
    } catch (error) {
      console.error(error);
    }
  };

  // פונקציה חדשה לאישור בקשת הרשמה לשיעור
  const handleRegistrationRequest = async (sender_id, lesson_id) => {
    if (!user || !user.role) {
      console.error("User role not available");
      return;
    }

    if (user.role !== "teacher" && user.role !== "admin") {
      console.warn("למשתמש אין הרשאות לאשר הרשמה");
      return;
    }

    try {
      // שליחת בקשה לרישום תלמיד לשיעור
      const registerResponse = await fetch(`http://localhost:5000/lessons/${lesson_id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ user_id: sender_id, status: "registered" })
      });

      if (!registerResponse.ok) {
        console.error("שגיאה בהרשמה לשיעור");
        return;
      }

      // שליחת הודעת אישור לתלמיד
      const messageResponse = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          sender_id: currentUserId,
          receiver_id: sender_id,
          content: `אישרת את הרשמתך לשיעור`
        })
      });

      if (!messageResponse.ok) {
        console.error("שגיאה בשליחת הודעת האישור");
        return;
      }

      const sent = await messageResponse.json();
      setMessages(prev => [...prev, sent]);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isLoggedIn(user)) {
    return <p>יש להתחבר כדי לגשת להודעות</p>;
  }

  return (
    <div className="message-container">
      <h2>📬 תיבת ההודעות שלי</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="chat-layout">
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

        <div className="chat-box">
          {selectedUser ? (
            <>
              <h4>שיחה עם {selectedUser.user_name}</h4>
              <div
                className="messages"
                style={{
                  height: '350px',
                  overflowY: 'auto',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                {messages.length === 0 && <p>אין הודעות בשיחה זו</p>}
                {messages.map(msg => {
                  let contentObj = null;
                  let isApplication = false;
                  let isRegistrationRequest = false;
                  try {
                    contentObj = JSON.parse(msg.content);
                    if (contentObj.full_name && contentObj.email) {
                      isApplication = true;
                      messages.forEach(msg => {
                        try {
                          const parsed = JSON.parse(msg.content);
                          console.log("JSONNNNN:", parsed);
                        } catch {
                          console.log("טקסט רגיל:", msg.content);
                        }
                      });

                    }
                    // נניח שאם יש lesson_id זו בקשת הרשמה לשיעור
                    if (contentObj.lesson_id) {
                      isRegistrationRequest = true;
                    }
                  } catch { }

                  return (
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
                          wordWrap: 'break-word',
                          whiteSpace: 'pre-wrap',
                          direction: 'rtl'
                        }}
                      >
                        <strong>{msg.sender_id === currentUserId ? 'אני' : selectedUser.user_name}</strong>:<br />
                        {isApplication ? (
                          <div style={{ marginTop: 12, fontSize: '0.95rem', color: '#222' }}>
                            <div>שם מלא: {contentObj.full_name || '-'}</div>
                            <div>אימייל: {contentObj.email || '-'}</div>
                            {/* הוסף שדות נוספים לפי הצורך */}
                          </div>
                        ) : (
                          msg.content
                        )}

                        <div className="timestamp" style={{ marginTop: 6 }}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </div>

                        {isApplication && (
                          <button
                            onClick={() => handleRequest(msg.sender_id, null)}
                            className="request-badge"
                            style={{ marginTop: '6px', cursor: 'pointer', marginRight: '8px' }}
                          >
                            אישור מועמדות
                          </button>
                        )}

                        {isRegistrationRequest && (
                          <button
                            onClick={() => handleRegistrationRequest(msg.sender_id, contentObj.lesson_id)}
                            className="request-badge"
                            style={{ marginTop: '6px', cursor: 'pointer' }}
                          >
                            אישור הרשמה לשיעור
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <textarea
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="כתוב הודעה חדשה..."
                style={{
                  width: '100%',
                  height: '70px',
                  resize: 'none',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ccc'
                }}
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
