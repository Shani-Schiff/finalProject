const Users  = require('../models/Users');
const Posts  = require('../models/Posts');
const Todos = require('../models/Todos');

const models = {
    users: Users,
    posts: Posts,
    todos: Todos,
    // home: Posts,
    // login: Users,
    // register: Users,
};

const getModel =(modelName) => {
    console.log(modelName);
    const model = models[modelName];
    if (!model) throw new Error(`Model '${modelName}' not found`);
    return model;
};

exports.getAll = async (req, res) => {
    try {
        console.log(req);
        
        const model = getModel(req.params.type);
        const data = await model.findAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const model = getModel(req.params.type);
        const item = await model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const model = getModel(req.params.type);
        const newItem = await model.create(req.body);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const model = getModel(req.params.type);
        const item = await model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        await item.update(req.body);
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const model = getModel(req.params.type);
        const item = await model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        await item.destroy();
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
