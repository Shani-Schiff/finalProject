const Users = require('../models/User');
const Lessons = require('../models/Lesson');
const TeacherApplication = require('../models/TeacherApplication');
const Notifications = require('../models/Notification');
const Review = require('../models/Review');
const Media = require('../models/Media');
const logger = require('../logs/logger');
const nodemailer = require('nodemailer');

const models = {
    login: Users,
    users: Users,
    lessons: Lessons,
    TeacherApplication: TeacherApplication,
    notifications: Notifications,
    Review: Review,
    media: Media
};

const childRelations = {
    lessons: ['notifications', 'media', 'Review'],
    teachers: ['lessons'],
    students: ['lessons'],
};

// קבלת תתי אובייקטים
exports.getSubItems = async (req, res) => {
    const { type, id, subType } = req.params;

    if (!childRelations[type] || !childRelations[type].includes(subType)) {
        return res.status(400).json({ message: `הקשר בין ${type} ל-${subType} לא מוגדר.` });
    }

    try {
        const parent = await models[type].findByPk(id, {
            include: models[subType]
        });

        if (!parent) {
            return res.status(404).json({ message: `לא נמצא ${type} עם מזהה ${id}` });
        }

        res.json(parent[subType]);
    } catch (error) {
        logger.error(`שגיאה בקבלת ${subType} מתוך ${type} ${id}:`, error);
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};

exports.getAllLessons = async (req, res) => {
    try {
        const lessons = await Lessons.findAll();
        res.json(lessons);
    } catch (err) {
        logger.error("שגיאה בשליפת שיעורים:", err);
        res.status(500).json({ message: 'שגיאה בטעינת שיעורים' });
    }
};

// טיפול בטופס צור קשר
exports.sendContactForm = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await Notifications.create({
            user_id: 1,
            content: `התקבלה פנייה מ-${name} (${email}):\n${message}`,
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MANAGER_EMAIL,
                pass: process.env.MANAGER_EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.sendMail({
            from: email,
            to: process.env.MANAGER_EMAIL,
            subject: 'פנייה חדשה מהאתר',
            html: `<h2>פנייה חדשה התקבלה</h2>
             <p><strong>שם:</strong> ${name}</p>
             <p><strong>אימייל:</strong> ${email}</p>
             <p><strong>הודעה:</strong><br/>${message}</p>`
        });

        res.json({ message: 'הפנייה נשלחה בהצלחה' });
    } catch (error) {
        logger.error('שגיאה בשליחת טופס צור קשר:', error);
        res.status(500).json({ message: 'שגיאה בשליחת הטופס' });
    }
};

exports.getAll = async (req, res) => {
    const { type } = req.params;
    try {
        const data = await models[type].findAll();
        res.json(data);
    } catch (error) {
        logger.error(`שגיאה בקבלת כל ${type}:`, error);
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};

// יצירה
exports.create = async (req, res) => {
    const { type } = req.params;
    try {
        const newItem = await models[type].create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        logger.error(`שגיאה ביצירת ${type}:`, error);
        res.status(500).json({ message: 'שגיאה ביצירת אובייקט' });
    }
};

// עדכון
exports.update = async (req, res) => {
    const { type, id } = req.params;
    try {
        const item = await models[type].findByPk(id);
        if (!item) {
            return res.status(404).json({ message: `${type} עם מזהה ${id} לא נמצא` });
        }

        await item.update(req.body);
        res.json(item);
    } catch (error) {
        logger.error(`שגיאה בעדכון ${type} ${id}:`, error);
        res.status(500).json({ message: 'שגיאה בעדכון אובייקט' });
    }
};

// מחיקה
exports.delete = async (req, res) => {
    const { type, id } = req.params;
    try {
        const item = await models[type].findByPk(id);
        if (!item) {
            return res.status(404).json({ message: `${type} עם מזהה ${id} לא נמצא` });
        }

        await item.destroy();
        res.json({ message: `${type} נמחק בהצלחה` });
    } catch (error) {
        logger.error(`שגיאה במחיקת ${type} ${id}:`, error);
        res.status(500).json({ message: 'שגיאה במחיקת אובייקט' });
    }
};