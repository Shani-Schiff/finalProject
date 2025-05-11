const Users = require('../models/Users');
const Posts = require('../models/Posts');
const Todos = require('../models/Todos');
const Comments = require('../models/Comments');
const logger = require('../logs/logger');

const models = {
    login: Users,
    users: Users,
    posts: Posts,
    todos: Todos,
    comments: Comments
};

const childRelations = {
    posts: ['comments'],
};

const getModel = (modelName) => {
    const model = models[modelName.toLowerCase()];
    if (!model) throw new Error(`Model '${modelName}' not found`);
    return model;
};

exports.getAll = async (req, res) => {
    try {
        const model = getModel(req.params.type);
        const userId = parseInt(req.params.userId, 10);
        const data = await model.findAll({
            where: { userId }
        });

        logger.info(`User ${userId} retrieved all ${req.params.type}`);
        res.json(data);
    } catch (err) {
        logger.error(`Error retrieving ${req.params.type}: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const model = getModel(req.params.type);
        const item = await model.findByPk(req.params.id);

        if (!item) {
            logger.warn(`${req.params.type} with ID ${req.params.id} not found`);
            return res.status(404).json({ error: 'Not found' });
        }

        if (item.userId != req.params.userId) {
            logger.warn(`User ${req.params.userId} attempted to access ${req.params.type} ID ${req.params.id} without permission`);
            return res.status(403).json({ error: 'Forbidden: Not owner' });
        }

        logger.info(`User ${req.params.userId} retrieved ${req.params.type} ID ${req.params.id}`);
        res.json(item);
    } catch (err) {
        logger.error(`Error retrieving ${req.params.type} ID ${req.params.id}: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.getSubItems = async (req, res) => {
    try {
        const { userId, type, id, subtype } = req.params;

        const mainModel = getModel(type);
        const subModel = models[subtype.toLowerCase()];
        if (!subModel) {
            logger.warn(`User ${userId} attempted to access invalid subtype: ${subtype}`);
            return res.status(400).json({ error: `Unsupported subtype: ${subtype}` });
        }

        const mainItem = await mainModel.findByPk(id);
        if (!mainItem) {
            logger.warn(`${type} with ID ${id} not found`);
            return res.status(404).json({ error: `${type} not found` });
        }

        if (mainItem.userId != userId) {
            logger.warn(`User ${userId} attempted to access ${type} ID ${id} without permission`);
            return res.status(403).json({ error: 'Forbidden: Item does not belong to user' });
        }

        const foreignKey = `${type.slice(0, -1)}Id`;
        const subItems = await subModel.findAll({
            where: { [foreignKey]: id }
        });

        logger.info(`User ${userId} retrieved ${subtype} for ${type} ID ${id}`);
        res.json(subItems);
    } catch (err) {
        logger.error(`Error retrieving subitems: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { userId, type, id, subtype } = req.params;

        if (subtype) {
            const mainModel = getModel(type);
            const subModel = getModel(subtype);

            const mainItem = await mainModel.findByPk(id);
            if (!mainItem) {
                logger.warn(`${type} with ID ${id} not found for subitem creation`);
                return res.status(404).json({ error: `${type} not found` });
            }

            if (mainItem.userId != userId) {
                logger.warn(`User ${userId} attempted to create ${subtype} for ${type} ID ${id} without permission`);
                return res.status(403).json({ error: 'Forbidden: Not owner of parent item' });
            }

            const foreignKey = `${type.slice(0, -1)}Id`;
            const newSubItem = await subModel.create({
                ...req.body,
                [foreignKey]: id,
                userId
            });

            logger.info(`User ${userId} created new ${subtype} under ${type} ID ${id}`);
            return res.status(201).json(newSubItem);
        }

        const model = getModel(type);
        const newItem = await model.create({
            ...req.body,
            userId
        });

        logger.info(`User ${userId} created new ${type} with ID ${newItem.id}`);
        res.status(201).json(newItem);
    } catch (err) {
        logger.error(`Error creating item: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { userId, type, id, subtype } = req.params;

        if (subtype) {
            const mainModel = getModel(type);
            const subModel = getModel(subtype);

            const mainItem = await mainModel.findByPk(id);
            if (!mainItem) {
                logger.warn(`${type} with ID ${id} not found for subitem update`);
                return res.status(404).json({ error: `${type} not found` });
            }

            if (mainItem.userId != userId) {
                logger.warn(`User ${userId} attempted to update ${subtype} for ${type} ID ${id} without permission`);
                return res.status(403).json({ error: 'Forbidden: Not owner of parent item' });
            }

            const subId = req.params.subId;
            if (!subId) {
                return res.status(400).json({ error: 'Missing subitem ID' });
            }

            const subItem = await subModel.findByPk(subId);
            if (!subItem) {
                logger.warn(`${subtype} with ID ${subId} not found`);
                return res.status(404).json({ error: `${subtype} not found` });
            }

            const foreignKey = `${type.slice(0, -1)}Id`;
            if (subItem[foreignKey] != id) {
                logger.warn(`${subtype} with ID ${subId} does not belong to ${type} ID ${id}`);
                return res.status(403).json({ error: `${subtype} does not belong to this ${type}` });
            }

            await subItem.update(req.body);
            logger.info(`User ${userId} updated ${subtype} ID ${subId}`);
            return res.json(subItem);
        }

        const model = getModel(type);
        const item = await model.findByPk(id);

        if (!item) {
            logger.warn(`${type} with ID ${id} not found for update`);
            return res.status(404).json({ error: 'Not found' });
        }

        if (item.userId != userId) {
            logger.warn(`User ${userId} attempted to update ${type} ID ${id} without permission`);
            return res.status(403).json({ error: 'Forbidden: Not owner' });
        }

        await item.update(req.body);
        logger.info(`User ${userId} updated ${type} ID ${id}`);
        res.json(item);
    } catch (err) {
        logger.error(`Error updating item: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const { userId, type, id, subtype } = req.params;

        if (subtype) {
            const mainModel = getModel(type);
            const subModel = getModel(subtype);

            const mainItem = await mainModel.findByPk(id);
            if (!mainItem) {
                logger.warn(`${type} with ID ${id} not found for subitem deletion`);
                return res.status(404).json({ error: `${type} not found` });
            }

            if (mainItem.userId != userId) {
                logger.warn(`User ${userId} attempted to delete ${subtype} for ${type} ID ${id} without permission`);
                return res.status(403).json({ error: 'Forbidden: Not owner of parent item' });
            }

            const subId = req.params.subId;
            if (!subId) {
                return res.status(400).json({ error: 'Missing subitem ID' });
            }

            const subItem = await subModel.findByPk(subId);
            if (!subItem) {
                logger.warn(`${subtype} with ID ${subId} not found`);
                return res.status(404).json({ error: `${subtype} not found` });
            }

            const foreignKey = `${type.slice(0, -1)}Id`;
            if (subItem[foreignKey] != id) {
                logger.warn(`${subtype} with ID ${subId} does not belong to ${type} ID ${id}`);
                return res.status(403).json({ error: `${subtype} does not belong to this ${type}` });
            }

            await subItem.destroy();
            logger.info(`User ${userId} deleted ${subtype} ID ${subId}`);
            return res.json({ message: 'Deleted successfully' });
        }

        const model = getModel(type);
        const item = await model.findByPk(id);

        if (!item) {
            logger.warn(`${type} with ID ${id} not found for deletion`);
            return res.status(404).json({ error: 'Not found' });
        }

        if (item.userId != userId) {
            logger.warn(`User ${userId} attempted to delete ${type} ID ${id} without permission`);
            return res.status(403).json({ error: 'Forbidden: Not owner' });
        }

        if (childRelations[type]) {
            for (const childType of childRelations[type]) {
                const childModel = getModel(childType);
                const foreignKey = `${type.slice(0, -1)}Id`;

                const childItems = await childModel.findAll({
                    where: { [foreignKey]: id }
                });

                for (const childItem of childItems) {
                    await childItem.destroy();
                    logger.info(`Cascade deleted ${childType} ID ${childItem.id} for ${type} ID ${id}`);
                }
            }
        }

        await item.destroy();
        logger.info(`User ${userId} deleted ${type} ID ${id}`);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        logger.error(`Error deleting item: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Posts.findAll();
        logger.info(`Retrieved all posts`);
        res.json(posts);
    } catch (err) {
        logger.error(`Error retrieving all posts: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};