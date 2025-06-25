require('dotenv').config();

const express = require('express');
const cors = require("cors");

const authRoutes = require('./routes/auth.routes');
const teacherRoutes = require('./routes/teacher.routes');
const lessonRoutes = require('./routes/lesson.routes');
const subjectRoutes = require('./routes/subject.routes');
const userRoutes = require('./routes/user.routes');
const messageRoutes = require('./routes/message.routes');
const contactRoutes = require('./routes/contact.routes');
const applicationRoutes = require('./routes/application.routes');
const genericRoutes = require('./routes/generic.routes');

const { verifyToken } = require('./middleware/auth');
const sequelize = require('../dataBase/dataBase');

const app = express();
app.use(express.json());
app.use(cors());

// ראוטים פתוחים - לא דורשים טוקן
app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);
app.use('/teachers', teacherRoutes);
app.use('/apply-teacher', applicationRoutes);
app.use('/subjects', subjectRoutes);
app.use('/lessons', lessonRoutes);

// ראוטים מוגנים בטוקן
app.use('/users', verifyToken, userRoutes);
app.use('/messages', verifyToken, messageRoutes);
app.use('/', verifyToken, genericRoutes);

const port = process.env.SERVER_PORT;
const hostname = process.env.SERVER_HOSTNAME;

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port} hostname: ${hostname}`);
    });
});
