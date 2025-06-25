const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/teachers', require('./teacher.routes'));
router.use('/lessons', require('./lesson.routes'));
router.use('/subjects', require('./subject.routes'));
router.use('/users', require('./user.routes'));
router.use('/messages', require('./message.routes'));
router.use('/contact', require('./contact.routes'));
router.use('/apply-teacher', require('./application.routes'));

router.use('/', require('./generic.routes'));

module.exports = router;

// const express = require('express');
// const router = express.Router();

// const service = require('../services/service');
// const authService = require('../services/authService');
// const messageService = require('../services/messageService');
// const { verifyToken } = require('../middleware/auth');

// // ==========================
// // 🔓 נתיבים ציבוריים (לא דורשים התחברות)
// // ==========================

// // 🧑‍💻 התחברות והרשמה
// router.post('/register', authService.register);
// router.post('/login', authService.login);

// // 📬 טפסים פתוחים
// router.post('/apply-teacher', service.uploadMiddleware, service.applyTeacher);
// router.post('/contact', service.sendContactForm);

// // 📚 מידע כללי – מורים, שיעורים
// router.get('/lessons', service.getAllGeneric);           // כל השיעורים
// router.get('/lessons/:id', service.getGenericById);      // שיעור לפי ID

// router.get('/teachers', service.getAllTeachers);         // כל המורים
// router.get('/teachers/:id', service.getTeacherById);     // מורה לפי ID

// // 📘 מקצועות
// router.get('/subjects', service.getAllSubjects);               // כל המקצועות
// router.get('/subjects/:id', service.getSubjectById);           // מקצוע לפי ID
// router.get('/subjects/:id/lessons', service.getLessonsBySubjectId); // כל השיעורים של מקצוע מסוים

// // 💬 הודעות בין משתמשים
// router.get('/users', service.getAllUsers); // כל המשתמשים
// router.post('/messages', messageService.sendMessage);
// router.post('/messages/by-email', messageService.sendMessageByEmail);
// router.get('/messages/:user1/:user2', messageService.getConversation);
// router.put('/users/:userId', service.updateUserRole);

// router.get('/users/:user_id', service.getUserLessons); // כל השיעורים של המשתמש (כמורה או תלמיד)

// // ==========================
// // 🔐 נתיבים מוגנים – דורשים טוקן
// // ==========================
// router.use(verifyToken);

// // 👤 מידע אישי של משתמש

// // 👨‍🏫 מורה - כל שיעוריו
// router.get('/teachers/:id', service.getTeacherLessons);

// // 🧾 יצירה / קריאה / עדכון / מחיקה של שיעורים, תלמידים, מדיה ועוד
// router.route('/users/:user_id/lessons') // ⬅️ עיקרי
//   .get(service.getAll)
//   .post(service.create);

// // מסלול כללי לפי סוג אובייקט (lessons, media וכו')
// const userBasePath = '/users/:user_id/:type';
// router.route(userBasePath)
//   .get(service.getAll)
//   .post(service.create);

// router.route(`${userBasePath}/:id`)
//   .get(service.getAll)
//   .put(service.update)
//   .delete(service.delete);

// // תתי-פריטים (כמו: /users/3/lessons/9/media)
// const subItemPath = `${userBasePath}/:id/:subtype`;
// router.route(subItemPath)
//   .get(service.getSubItems)
//   .post(service.create);

// router.route(`${subItemPath}/:subId`)
//   .put(service.update)
//   .delete(service.delete);

// module.exports = router;




// const express = require('express');
// const router = express.Router();

// const controller = require('../controllers/controller');
// const authController = require('../controllers/authController');
// const messageController = require('../controllers/messageController');
// const { verifyToken } = require('../middleware/auth');

// // 🧑‍💻 התחברות והרשמה
// router.post('/register', authController.register);
// router.post('/login', authController.login);

// // 📬 טפסים פתוחים
// router.post('/apply-teacher', controller.uploadMiddleware, controller.applyTeacher);
// router.post('/contact', controller.sendContactForm);

// // 📚 מידע כללי – מורים, שיעורים
// router.get('/lessons', controller.getAllGeneric);           // כל השיעורים
// router.get('/lessons/:id', controller.getGenericById);      // שיעור לפי ID
// router.post('/lessons', controller.createLesson);


// router.get('/teachers', controller.getAllTeachers);         // כל המורים
// router.get('/teachers/:id', controller.getTeacherById);     // מורה לפי ID

// // 📘 מקצועות
// router.get('/subjects', controller.getAllGeneric);               // כל המקצועות
// router.get('/subjects/:id', controller.getSubjectById);           // מקצוע לפי ID
// router.get('/subjects/:id/lessons', controller.getLessonsBySubjectId); // כל השיעורים של מקצוע מסוים

// // 💬 הודעות בין משתמשים
// router.get('/users', controller.getAllUsers); // כל המשתמשים
// router.post('/messages', messageController.sendMessage);
// router.post('/messages/by-email', messageController.sendMessageByEmail);
// router.get('/messages/:user1/:user2', messageController.getConversation);
// router.put('/users/:userId', controller.updateUserRole);

// router.get('/users/:user_id', controller.getUserLessons); // כל השיעורים של המשתמש (כמורה או תלמיד)
// router.post('/lessons/:lesson_id/register', controller.registerStudentToLesson);



// // ==========================
// // 🔐 נתיבים מוגנים – דורשים טוקן
// // ==========================
// router.use(verifyToken);

// // 👤 מידע אישי של משתמש

// // 👨‍🏫 מורה - כל שיעוריו
// router.get('/teachers/:id', controller.getTeacherLessons);

// // 🧾 יצירה / קריאה / עדכון / מחיקה של שיעורים, תלמידים, מדיה ועוד
// router.route('/users/:user_id/lessons') // ⬅️ עיקרי
//   .get(controller.getAll)
//   .post(controller.create);

// // מסלול כללי לפי סוג אובייקט (lessons, media וכו')
// const userBasePath = '/users/:user_id/:type';
// router.route(userBasePath)
//   .get(controller.getAll)
//   .post(controller.create);

// router.route(`${userBasePath}/:id`)
//   .get(controller.getAll)
//   .put(controller.update)
//   .delete(controller.delete);

// // תתי-פריטים (כמו: /users/3/lessons/9/media)
// const subItemPath = `${userBasePath}/:id/:subtype`;
// router.route(subItemPath)
//   .get(controller.getSubItems)
//   .post(controller.create);

// router.route(`${subItemPath}/:subId`)
//   .put(controller.update)
//   .delete(controller.delete);

// module.exports = router;
