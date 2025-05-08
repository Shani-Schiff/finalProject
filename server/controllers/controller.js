const Users = require('../models/Users');
const Posts = require('../models/Posts');
const Todos = require('../models/Todos');
const Comments = require('../models/Comments');


const models = {
    login:Users,
    users: Users,
    posts: Posts,
    todos: Todos,
    comments:Comments
};

const getModel = (modelName) => {
    const model = models[modelName.toLowerCase()];
    if (!model) throw new Error(`Model '${modelName}' not found`);
    return model;
};

// פוסטים של כל המשתמשים
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Posts.findAll();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// כל הפוסטים / todos של יוזר מסוים
exports.getAll = async (req, res) => {
    try {
        const model = getModel(req.params.type);
        const userId = parseInt(req.params.userId, 10); // לוודא שזה מספר
        const data = await model.findAll({
            where: { userId }  // בלי req.params בתור ערך ישירות
        });
        
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// פריט בודד של יוזר
exports.getById = async (req, res) => {
    try {
        const model = getModel(req.params.type);
        const item = await model.findByPk(req.params.id);

        if (!item) return res.status(404).json({ error: 'Not found' });
        if (item.userId != req.params.userId) {
            return res.status(403).json({ error: 'Forbidden: Not owner' });
        }

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSubItems = async (req, res) => {
    try {
        const { userId, type, id, subtype } = req.params;

        const mainModel = getModel(type);
        const subModel = models[subtype.toLowerCase()];
        if (!subModel) return res.status(400).json({ error: `Unsupported subtype: ${subtype}` });
        // ודא שהפריט הראשי קיים ושייך ליוזר
        const mainItem = await mainModel.findByPk(id);
        if (!mainItem) return res.status(404).json({ error: `${type} not found` });
        if (mainItem.userId != userId) {
            return res.status(403).json({ error: 'Forbidden: Item does not belong to user' });
        }

        // משיכת התת-פריטים (comments, וכו')
        const foreignKey = `${type.slice(0, -1)}Id`; // "posts" -> "postId"
        const subItems = await subModel.findAll({
            where: { [foreignKey]: id }
        });

        res.json(subItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// יצירת פריט חדש ליוזר
exports.create = async (req, res) => {
    try {
        const model = getModel(req.params.type);
        const newItem = await model.create({
            ...req.body,
            userId: req.params.userId
        });
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// עדכון פריט של יוזר
exports.update = async (req, res) => {
    try {
        const model = getModel(req.params.type);
        const item = await model.findByPk(req.params.id);

        if (!item) return res.status(404).json({ error: 'Not found' });
        if (item.userId != req.params.userId) {
            return res.status(403).json({ error: 'Forbidden: Not owner' });
        }

        await item.update(req.body);
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// מחיקת פריט של יוזר
exports.delete = async (req, res) => {
    try {
        const model = getModel(req.params.type);
        const item = await model.findByPk(req.params.id);

        if (!item) return res.status(404).json({ error: 'Not found' });
        if (item.userId != req.params.userId) {
            return res.status(403).json({ error: 'Forbidden: Not owner' });
        }

        await item.destroy();
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
