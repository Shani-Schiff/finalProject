const express = require('express');
const router = express.Router();

const controller = require('../controllers/controller');
const authController = require('../controllers/authController');
const messageController = require('../controllers/messageController');
const { verifyToken } = require('../middleware/auth');

// ==================
// 🔓 נתיבים פתוחים (ללא התחברות)
// ==================

// 🔐 משתמשים והתחברות
router.post('/register', authController.register);
router.post('/login', authController.login);

// 📬 צור קשר + בקשה להצטרפות כמורה
router.post('/apply-teacher', controller.uploadMiddleware, controller.applyTeacher);
router.post('/contact', controller.sendContactForm);

// 📚 שיעורים ומורים
router.get('/lessons', controller.getAllGeneric);
router.get('/lessons/:id', controller.getGenericById);
router.get('/teachers', controller.getAllTeachers);
router.get('/teachers/:id', controller.getTeacherById);

// 💬 הודעות
router.get('/users', controller.getAllUsers);
router.post('/messages', messageController.sendMessage);
router.post('/messages/by-email', messageController.sendMessageByEmail);
router.get('/messages/:user1/:user2', messageController.getConversation);

// 📘 מקצועות
router.get('/subjects', controller.getAllSubjects);
router.get('/subjects/:id', controller.getSubjectById);
router.get('/subjects/:id/lessons', controller.getLessonsBySubjectId);

// ==================
// 🔐 נתיבים מוגנים – דורשים טוקן
// ==================

router.use(verifyToken);

// 👥 שיעורים של משתמש/מורה
router.get('/users/:user_id/lessons', controller.getUserLessons);
router.get('/teachers/:id/lessons', controller.getTeacherLessons);

// 🔄 נתיבים כלליים לפי סוג (למשל /users/5/lessons)
const userBasePath = '/users/:user_id/:type';

router.route(userBasePath)
  .get(controller.getAll)
  .post(controller.create);

router.route(`${userBasePath}/:id`)
  .get(controller.getAll)
  .put(controller.update)
  .delete(controller.delete);

// 📁 תתי-אובייקטים (למשל /users/5/lessons/3/media)
const subItemPath = `${userBasePath}/:id/:subtype`;

router.route(subItemPath)
  .get(controller.getSubItems)
  .post(controller.create);

router.route(`${subItemPath}/:subId`)
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;
