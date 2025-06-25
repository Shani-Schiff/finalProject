const express = require('express');
const router = express.Router();
const service = require('../services/service');

router.get('/', service.getAllSubjects);
router.get('/:id', service.getSubjectById);
router.get('/:id/lessons', service.getLessonsBySubjectId);

module.exports = router;
