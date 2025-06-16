import { useState } from "react";
import "../styles/questions.css";

const faqList = [
  {
    question: "איך נרשמים לשיעור?",
    answer: "כל תלמיד רשום יכול להיכנס לעמוד 'שיעורים', לבחור שיעור שמתאים לו לפי מקצוע, שכבה ורמת בגרות, וללחוץ על כפתור ההרשמה."
  },
  {
    question: "איך מגישים בקשה להיות מורה?",
    answer: "יש להירשם לאתר, לבחור באופציית 'אני מורה', ולמלא טופס מועמדות הכולל קובץ קורות חיים ופרטים נוספים. לאחר מכן החשבון יעבור לאישור מנהל."
  },
  {
    question: "איך ניתן ליצור קשר עם מורה?",
    answer: "תלמידים שנרשמו לשיעור מסוים יכולים לשלוח הודעה ישירה למורה דרך אזור ההודעות."
  },
  {
    question: "מה קורה אם שיעור מתבטל?",
    answer: "במקרה של ביטול, תישלח התראה לתלמידים שנרשמו לשיעור, והם יוכלו לבחור שיעור חלופי."
  },
  {
    question: "האם אפשר לראות את מערכת השעות שלי?",
    answer: "כן! תלמידים ומורים יכולים להיכנס לאזור האישי ולצפות במערכת השעות האישית שלהם הכוללת את כל השיעורים שאליהם הם משויכים."
  }
];

export default function Questions() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="faq-container">
      <h2>שאלות נפוצות</h2>
      <div className="faq-list">
        {faqList.map((item, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? "open" : ""}`}>
            <button className="faq-question" onClick={() => toggle(index)}>
              {item.question}
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}