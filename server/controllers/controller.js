const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const logger = require('../logs/logger');

const Users = require('../models/User');
const Lessons = require('../models/Lesson');
const TeacherApplication = require('../models/TeacherApplication');
const Notifications = require('../models/Notification');
const Review = require('../models/Review');
const Media = require('../models/Media');
const { where } = require('sequelize');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

exports.uploadMiddleware = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'cv', maxCount: 1 }
]);

const models = {
    login: Users,
    users: Users,
    lessons: Lessons,
    teachers: Users,
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
//students
exports.getAllGeneric = async (req, res) => {
    try {
        // const type = req.url.split('/')[1];
        const type = req.path.split('/')[1].toLowerCase();
        if (!models[type]) {
            return res.status(400).json({ message: `המודל '${type}' לא קיים` });
        }
        const lessons = await models[type].findAll();
        res.json(lessons);
    } catch (err) {
        logger.error("שגיאה בשליפת :", err);
        res.status(500).json({ message: 'שגיאה בטעינת ' });
    }
};
//teachers
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Users.findAll({
            where: { role: 'teacher' },
            attributes: ['user_id', 'user_name', 'email']
        });
        res.json(teachers);
    } catch (err) {
        logger.error("שגיאה בשליפת המורים:", err);
        res.status(500).json({ message: 'שגיאה בטעינת המורים' });
    }
};

//messages
exports.getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['user_id', 'email']
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'שגיאה בקבלת משתמשים' });
    }
};


exports.applyTeacher = async (req, res) => {
    try {
        const {
            full_name,
            email,
            phone,
            subjects,
            description,
            experience,
            location
        } = req.body;

        const image = req.files?.image?.[0]?.path || null;
        const cv = req.files?.cv?.[0]?.path || null;

        await TeacherApplication.create({
            full_name,
            email,
            phone,
            subjects,
            description,
            experience,
            location,
            image: image,
            cv: cv
        });

        await Notifications.create({
            user_id: 1, // מזהה מנהל
            content: `בקשת הצטרפות חדשה התקבלה מ-${full_name} (${email})`
        });

        res.json({ message: 'הבקשה נשלחה בהצלחה!' });
    } catch (error) {
        logger.error('שגיאה בהגשת בקשת מורה:', error);
        res.status(500).json({ message: 'שגיאה בשליחת הבקשה' });
    }
};

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

exports.getGenericById = async (req, res) => {
    const { id } = req.params;
    const type = 'lessons'; // מאחר וזה נתיב קבוע /lessons/:id

    try {
        const item = await models[type].findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'שיעור לא נמצא' });
        }
        res.json(item);
    } catch (error) {
        logger.error(`שגיאה בקבלת ${type} עם מזהה ${id}:`, error);
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};

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
