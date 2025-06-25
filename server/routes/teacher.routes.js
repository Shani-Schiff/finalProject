const express = require('express');
const router = express.Router();
const service = require('../services/service');

router.get('/', service.getAllTeachers);
router.get('/:id', service.getTeacherById);
router.get('/:id/lessons', service.getTeacherLessons);

module.exports = router;
