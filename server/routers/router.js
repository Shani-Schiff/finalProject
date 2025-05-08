const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth'); 

router.post('/register', authController.register);
router.post('/login', authController.login);

router.use(verifyToken);

router.get('/users/all/posts', controller.getAllPosts);
router.get('/:type/:id', controller.getById);

router.get('/users/:userId/:type', controller.getAll);
router.get('/users/:userId/:type/:id', controller.getById);
router.get('/users/:userId/:type/:id/:subtype', controller.getSubItems);

// יצירה של פריט חדש
router.post('/users/:userId/:type', controller.create);

//הוספת תגובה
router.post('/users/:userId/:type/:id/:subtype', controller.create);

// עדכון פריט
router.put('/users/:userId/:type/:id', controller.update);

// מחיקת פריט
router.delete('/users/:userId/:type/:id', controller.delete);

module.exports = router;
