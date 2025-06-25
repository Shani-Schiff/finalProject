const express = require('express');
const router = express.Router();
const messageService = require('../services/messageService');

router.post('/', messageService.sendMessage);
router.post('/by-email', messageService.sendMessageByEmail);
router.get('/:user1/:user2', messageService.getConversation);
router.get('/conversations/:userId', messageService.getUserConversations);

module.exports = router;
