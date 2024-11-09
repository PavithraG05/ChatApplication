const express = require('express');
const router = express.Router()
const protected = require('../middleware/authMiddleware')
const {sendMessage, allMessages} = require('../controllers/messageController')

router.post('/', protected, sendMessage);
router.get('/:chatId',protected, allMessages);

module.exports = router