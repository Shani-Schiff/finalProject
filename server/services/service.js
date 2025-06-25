const multer = require('multer');
const nodemailer = require('nodemailer');
const logger = require('../logs/logger');

// הגדרת multer לשימוש עם Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });
exports.uploadMiddleware = upload.fields([{ name: 'image' }, { name: 'cv' }]);

// === מודלים ===
const models = require('../models');
const {
  User,
  UserRole,
  Subject,
  Lesson,
  TeacherApplication,
  Notification,
  Review,
  Media
} = models;

const childRelations = {
    lessons: ['notifications', 'media', 'Review'],
    teachers: ['lessons'],
    students: ['lessons'],
};

// === מקצועות ===
exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll();
        res.json(subjects);
    } catch (err) {
        logger.error("שגיאה בטעינת מקצועות:", err);
        res.status(500).json({ message: 'שגיאה בטעינת מקצועות' });
    }
};

exports.getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findByPk(req.params.id);
        if (!subject) return res.status(404).json({ message: "מקצוע לא נמצא" });
        res.json(subject);
    } catch (err) {
        logger.error("שגיאה בטעינת מקצוע:", err);
        res.status(500).json({ message: 'שגיאה בטעינת מקצוע' });
    }
};

exports.getLessonsBySubjectId = async (req, res) => {
    try {
        const subjectId = req.params.id;
        const lessons = await Lesson.findAll({
            where: { subject_id: subjectId },
            include: [{
                model: User,
                as: 'teacher',
                attributes: ['user_name']
            }]
        });
        res.json(lessons);
    } catch (error) {
        logger.error('⚠️ שגיאה בטעינת שיעורים לפי מקצוע:', error);
        res.status(500).json({ message: 'שגיאה בטעינת שיעורים לפי מקצוע' });
    }
};

// === מורים ומשתמשים ===
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.findAll({
            where: { role: 'teacher' },
            attributes: ['user_id', 'user_name', 'email']
        });
        res.json(teachers);
    } catch (err) {
        logger.error("שגיאה בשליפת המורים:", err);
        res.status(500).json({ message: 'שגיאה בטעינת מורים' });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await User.findByPk(req.params.id, {
            attributes: ['user_id', 'user_name', 'email', 'phone_number', 'role']
        });
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(404).json({ message: 'מורה לא נמצא' });
        }
        res.json(teacher);
    } catch (error) {
        logger.error('שגיאה בקבלת פרטי מורה:', error);
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['user_id', 'email'] });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'שגיאה בקבלת משתמשים' });
    }
};

// === פנייה מהמורה (כולל העלאת קבצים לבסיס נתונים) ===
exports.applyTeacher = async (req, res) => {
    try {
        const { full_name, email, phone, subjects, description, experience, location } = req.body;
        const files = req.files;
        const mediaRecords = [];

        if (files?.image?.[0]) {
            mediaRecords.push({
                lesson_id: null,
                file_type: 'image',
                file_name: files.image[0].originalname,
                file_data: files.image[0].buffer,
                description: 'תמונה למורה'
            });
        }

        if (files?.cv?.[0]) {
            mediaRecords.push({
                lesson_id: null,
                file_type: 'pdf',
                file_name: files.cv[0].originalname,
                file_data: files.cv[0].buffer,
                description: 'קורות חיים'
            });
        }

        await Media.bulkCreate(mediaRecords);

        await TeacherApplication.create({
            full_name, email, phone, subjects, description, experience, location
        });

        await Notifications.create({
            user_id: 1,
            content: `בקשת הצטרפות חדשה התקבלה מ-${full_name} (${email})`
        });

        res.status(201).json({ message: 'הבקשה נשלחה בהצלחה!' });
    } catch (error) {
        logger.error('שגיאה בהגשת בקשת מורה:', error);
        res.status(500).json({ message: 'שגיאה בשליחת הבקשה' });
    }
};

// === צור קשר ===
exports.sendContactForm = async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await Notifications.create({
            user_id: 1,
            content: `התקבלה פנייה מ-${name} (${email}):\n${message}`
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MANAGER_EMAIL,
                pass: process.env.MANAGER_EMAIL_PASSWORD
            },
            tls: { rejectUnauthorized: false }
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

// === כלליים ודינמיים ===
exports.getAllGeneric = async (req, res) => {
    try {
        const type = req.path.split('/')[1].toLowerCase();
        if (!models[type]) {
            return res.status(400).json({ message: `מודל '${type}' לא קיים` });
        }
        const results = await models[type].findAll();
        res.json(results);
    } catch (error) {
        logger.error("שגיאה בשליפת רשומות:", error);
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};

exports.getGenericById = async (req, res) => {
    const { id } = req.params;
    const type = 'lessons';
    try {
        const item = await models[type].findByPk(id, {
            include: [
                { model: models.User, as: 'teacher', attributes: ['user_id', 'user_name'] },
                { model: models.Subject, attributes: ['subject_name'] }
            ]
        });
        if (!item) return res.status(404).json({ message: 'שיעור לא נמצא' });

        res.json({
            ...item.toJSON(),
            teacher: item.teacher?.user_name,
            subject: item.Subject?.subject_name
        });
    } catch (error) {
        logger.error("שגיאה בקבלת פריט לפי מזהה:", error);
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};

// === שיעורים לפי משתמש או מורה ===
exports.getUserLessons = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.user_id);
        if (!user) return res.status(404).json({ message: 'משתמש לא נמצא' });

        console.log("typeof user.getStudentLessons:", typeof user.getStudentLessons); // ← הוסיפי כאן

        if (user.role === 'student') {
            const lessons = await user.getStudentLessons({
                include: [{ model: User, as: 'teacher', attributes: ['user_name'] }]
            });
            return res.json(lessons);
        }

        if (user.role === 'teacher') {
            const lessons = await user.getTeachingLessons({
                include: [{ model: User, as: 'students', attributes: ['user_name'] }]
            });
            return res.json(lessons);
        }

        return res.json([]);
    } catch (error) {
        logger.error("שגיאה בשליפת שיעורי משתמש:", error);
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};

exports.getTeacherLessons = async (req, res) => {
    try {
        const teacher = await User.findByPk(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'מורה לא נמצא' });

        const lessons = await teacher.getTeachingLessons();
        res.json(lessons);
    } catch (error) {
        logger.error("שגיאה בשליפת שיעורי מורה:", error);
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};

// === ניהול אובייקטים כלליים ותתי אובייקטים ===
exports.getAll = async (req, res) => {
    const { type } = req.params;
    try {
        const data = await models[type].findAll();
        res.json(data);
    } catch (error) {
        logger.error(`שגיאה בקבלת ${type}:`, error);
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
        res.status(500).json({ message: 'שגיאה ביצירה' });
    }
};

exports.update = async (req, res) => {
    const { type, id } = req.params;
    try {
        const item = await models[type].findByPk(id);
        if (!item) return res.status(404).json({ message: `${type} לא נמצא` });

        await item.update(req.body);
        res.json(item);
    } catch (error) {
        logger.error(`שגיאה בעדכון ${type}:`, error);
        res.status(500).json({ message: 'שגיאה בעדכון' });
    }
};

exports.delete = async (req, res) => {
    const { type, id } = req.params;
    try {
        const item = await models[type].findByPk(id);
        if (!item) return res.status(404).json({ message: `${type} לא נמצא` });

        await item.destroy();
        res.json({ message: `${type} נמחק בהצלחה` });
    } catch (error) {
        logger.error(`שגיאה במחיקת ${type}:`, error);
        res.status(500).json({ message: 'שגיאה במחיקה' });
    }
};

exports.getSubItems = async (req, res) => {
    const { type, id, subType } = req.params;

    if (!childRelations[type] || !childRelations[type].includes(subType)) {
        return res.status(400).json({ message: `הקשר בין ${type} ל-${subType} לא מוגדר.` });
    }

    try {
        const parent = await models[type].findByPk(id, { include: models[subType] });
        if (!parent) return res.status(404).json({ message: `${type} לא נמצא` });

        res.json(parent[subType]);
    } catch (error) {
        logger.error(`שגיאה בקבלת ${subType} מתוך ${type}:`, error);
        res.status(500).json({ message: 'שגיאה בשרת' });
    }
};
exports.updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
        return res.status(400).send({ error: 'חסר role' });
    }

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ error: 'משתמש לא נמצא' });
        }

        user.role = role;
        await user.save();

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'שגיאת שרת' });
    }
};
