const express = require('express');
const router = express.Router();

const controller = require('../controllers/controller');
const authController = require('../controllers/authController');
const messageController = require('../controllers/messageController');
const { verifyToken } = require('../middleware/auth');

// ==========================
// 🔓 נתיבים ציבוריים (לא דורשים התחברות)
// ==========================

// 🧑‍💻 התחברות והרשמה
router.post('/register', authController.register);
router.post('/login', authController.login);

// 📬 טפסים פתוחים
router.post('/apply-teacher', controller.uploadMiddleware, controller.applyTeacher);
router.post('/contact', controller.sendContactForm);

// 📚 מידע כללי – מורים, שיעורים
router.get('/lessons', controller.getAllGeneric);           // כל השיעורים
router.get('/lessons/:id', controller.getGenericById);      // שיעור לפי ID

router.get('/teachers', controller.getAllTeachers);         // כל המורים
router.get('/teachers/:id', controller.getTeacherById);     // מורה לפי ID

// 📘 מקצועות
router.get('/subjects', controller.getAllSubjects);               // כל המקצועות
router.get('/subjects/:id', controller.getSubjectById);           // מקצוע לפי ID
router.get('/subjects/:id/lessons', controller.getLessonsBySubjectId); // כל השיעורים של מקצוע מסוים

// 💬 הודעות בין משתמשים
router.get('/users', controller.getAllUsers); // כל המשתמשים
router.post('/messages', messageController.sendMessage);
router.post('/messages/by-email', messageController.sendMessageByEmail);
router.get('/messages/:user1/:user2', messageController.getConversation);

// ==========================
// 🔐 נתיבים מוגנים – דורשים טוקן
// ==========================
router.use(verifyToken);

// 👤 מידע אישי של משתמש
router.get('/users/:user_id', controller.getUserLessons); // כל השיעורים של המשתמש (כמורה או תלמיד)

// 👨‍🏫 מורה - כל שיעוריו
router.get('/teachers/:id', controller.getTeacherLessons);

// 🧾 יצירה / קריאה / עדכון / מחיקה של שיעורים, תלמידים, מדיה ועוד
router.route('/users/:user_id/lessons') // ⬅️ עיקרי
  .get(controller.getAll)
  .post(controller.create);

// מסלול כללי לפי סוג אובייקט (lessons, media וכו')
const userBasePath = '/users/:user_id/:type';
router.route(userBasePath)
  .get(controller.getAll)
  .post(controller.create);

router.route(`${userBasePath}/:id`)
  .get(controller.getAll)
  .put(controller.update)
  .delete(controller.delete);

// תתי-פריטים (כמו: /users/3/lessons/9/media)
const subItemPath = `${userBasePath}/:id/:subtype`;
router.route(subItemPath)
  .get(controller.getSubItems)
  .post(controller.create);

router.route(`${subItemPath}/:subId`)
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;
