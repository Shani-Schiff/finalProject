const express = require('express');
const router = express.Router();
const service = require('../services/service');
const { verifyToken } = require('../middleware/auth');

router.get('/', service.getAllGeneric);
router.get('/:id/lessons', service.getLessonsBySubjectId);
router.get('/:id', service.getGenericById);
router.post('/', service.createLesson);
router.post("/:lessonId/register", verifyToken, service.registerToLesson);

module.exports = router;
