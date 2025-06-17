require('dotenv').config();

const express = require('express');
const cors = require("cors");

const router = require('./routers/router');
const { verifyToken } = require('./middleware/auth');
const sequelize = require('../dataBase/dataBase');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', router);

const port = process.env.SERVER_PORT;
const hostname = process.env.SERVER_HOSTNAME;

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port} hostname: ${hostname}`);
    });
});
