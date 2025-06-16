const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');

router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await Notification.create({
            user_id: 1,
            content: `התקבלה פנייה מ-${name} (${email}):\n${message}`,
        });

        // שליחת מייל
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
        console.error('שגיאה בשליחת טופס:', error);
        res.status(500).json({ message: 'שגיאה בשליחת הטופס' });
    }
});

module.exports = router;
