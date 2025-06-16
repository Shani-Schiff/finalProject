const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const Lessons = require('../models/Lesson');

console.log('authController:', authController);
console.log('controller:', controller);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/:type', controller.getAll);

router.use(verifyToken);

const userBasePath = '/users/:userId/:type';
router.route(userBasePath)
    .get(controller.getAll)
//     .post(controller.create);

// router.route(`${userBasePath}/:id`)
//     .get(controller.getById)
//     .put(controller.update)
//     .delete(controller.delete);

// const subItemPath = `${userBasePath}/:id/:subtype`;
// router.route(subItemPath)
//     .get(controller.getSubItems)
//     .post(controller.create);

// router.route(`${subItemPath}/:subId`)
//     .put(controller.update)
//     .delete(controller.delete);

module.exports = router;