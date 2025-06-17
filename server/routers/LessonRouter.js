const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

router.get('/', async (req, res) => {
    try {
        const lessons = await Lesson.findAll();
        res.json(lessons);
    } catch (err) {
        console.error("שגיאה בשליפת שיעורים:", err);
        res.status(500).json({ error: 'שגיאה בטעינת שיעורים' });
    }
});

module.exports = router;
