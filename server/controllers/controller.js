const { User, Post, Todo } = require('../models');

const models = {
    user: User,
    post: Post,
    todo: Todo
};

const getModel = (modelName) => {
    const model = models[modelName.toLowerCase()];
    if (!model) throw new Error(`Model '${modelName}' not found`);
    return model;
};

exports.getAll = async (req, res) => {
    try {
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

exports.remove = async (req, res) => {
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
