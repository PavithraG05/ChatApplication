const express = require('express')
const router = express.Router()
const protected = require("../middleware/authMiddleware")
const {accessChat} = require("../controllers/chatController")

router.post('/', protected, accessChat)

module.exports = router;