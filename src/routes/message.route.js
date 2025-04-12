const express = require('express');
const { protectRoute } = require('../middleware/auth.middleware');
const {
	getUsersForSidebar,
	getMessages,
	sendMessage,
} = require('../controllers/message.Controller');

const messageRouter = express.Router();

messageRouter.get('/users', protectRoute, getUsersForSidebar);
messageRouter.get('/:id', protectRoute, getMessages);
messageRouter.post('/send/:id', protectRoute, sendMessage);
module.exports = { messageRouter };
