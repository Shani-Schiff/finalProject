require('dotenv').config();

const express = require('express');
const cors = require("cors");

const contactRouter = require('./routers/ContactRouter');
const { verifyToken } = require('./middleware/auth');
const sequelize = require('../dataBase/dataBase');
const Lesson = require('./models/Lesson');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/contact', contactRouter);

app.get('/lessons', async (req, res) => {
    try {
        const lessons = await Lesson.findAll();
        res.json(lessons);
    } catch (err) {
        console.error("שגיאה בשליפת שיעורים:", err);
        res.status(500).json({ error: 'שגיאה בטעינת שיעורים' });
    }
});

const port = process.env.SERVER_PORT;
const hostname = process.env.SERVER_HOSTNAME;

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port} hostname: ${hostname}`);
    });
});
