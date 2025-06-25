const Message = require('../models/Message');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
    try {
        const { sender_id, receiver_id, content } = req.body;
        const message = await Message.create({ sender_id, receiver_id, content });
        res.status(201).json(message);
    } catch (err) {
        console.error('שגיאה בשליחת הודעה:', err);
        res.status(500).json({ message: 'שגיאה בשליחת הודעה' });
    }
};

exports.getUserConversations = async (req, res) => {
    const { userId } = req.params;
    try {
        const sent = await Message.findAll({ where: { sender_id: userId } });
        const received = await Message.findAll({ where: { receiver_id: userId } });

        const ids = new Set();
        sent.forEach(m => ids.add(m.receiver_id));
        received.forEach(m => ids.add(m.sender_id));
        ids.delete(parseInt(userId)); // להסיר את עצמו מהרשימה

        const users = await User.findAll({
            where: { user_id: [...ids] },
            attributes: ['user_id', 'user_name', 'email']
        });

        res.json(users);
    } catch (err) {
        console.error("שגיאה בקבלת שיחות:", err);
        res.status(500).json({ message: "שגיאה בקבלת שיחות" });
    }
};

exports.sendMessageByEmail = async (req, res) => {
    try {
        const { sender_id, receiver_email, content } = req.body;

        const receiver = await User.findOne({ where: { email: receiver_email } });
        if (!receiver) {
            return res.status(404).json({ message: "מקבל לא נמצא לפי האימייל" });
        }

        const message = await Message.create({
            sender_id,
            receiver_id: receiver.user_id,
            content
        });

        res.status(201).json(message);
    } catch (err) {
        console.error("שגיאה בשליחת הודעה לפי אימייל:", err);
        res.status(500).json({ message: "שגיאה בשרת" });
    }
};

exports.getConversation = async (req, res) => {
    const { user1, user2 } = req.params;
    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender_id: user1, receiver_id: user2 },
                    { sender_id: user2, receiver_id: user1 }
                ]
            },
            order: [['timestamp', 'ASC']]
        });
        res.json(messages);
    } catch (err) {
        console.error('שגיאה בשליפת שיחה:', err);
        res.status(500).json({ message: 'שגיאה בשליפת שיחה' });
    }
};
