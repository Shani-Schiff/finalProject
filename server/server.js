const express = require('express');
const cors = require("cors");

const Router = require('./routers/router');
const sequelize = require('./dataBase');
 
const app = express();
app.use(express.json());
app.use(cors());
// צריך לכתוב רק איזה כתובות הוא יכול לגשת

const port = 5000;
const hostname = '127.0.0.1';

app.use('/todos', Router);
app.use('/', Router);
app.use('/comments', Router);

app.use('/posts', Router);

sequelize.sync().then(() => {
    app.listen(5000, () => console.log(`"Server is running on port ${port} hostname: ${hostname}"`));
});
