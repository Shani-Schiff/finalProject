const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const messageController = require('../controllers/messageController');
const { Op } = require('sequelize');

router.get('/users', controller.getAllUsers);
router.post('/messages', messageController.sendMessage);
router.get('/messages/:user1/:user2', messageController.getConversation);
router.post('/messages/by-email', messageController.sendMessageByEmail);
router.get('/teachers/:id', controller.getTeacherById);

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/apply-teacher', controller.uploadMiddleware, controller.applyTeacher);
router.post('/contact', controller.sendContactForm);

router.get('/lessons', controller.getAllGeneric);
router.get('/lessons/:id', controller.getGenericById);
router.get('/teachers', controller.getAllTeachers);

router.get('/users/:user_id/lessons', controller.getUserLessons);
router.get('/teachers/:id/lessons', controller.getTeacherLessons);

router.use(verifyToken);

const userBasePath = '/users/:user_id/:type';

router.route(userBasePath)
    .get(controller.getAll)
    .post(controller.create);

router.route(`${userBasePath}/:id`)
    .get(controller.getAll)
    .put(controller.update)
    .delete(controller.delete);

const subItemPath = `${userBasePath}/:id/:subtype`;

router.route(subItemPath)
    .get(controller.getSubItems)
    .post(controller.create);

router.route(`${subItemPath}/:subId`)
    .put(controller.update)
    .delete(controller.delete);

module.exports = router;