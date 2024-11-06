const express = require('express')
const router = express.Router()
const protected = require("../middleware/authMiddleware")
const {accessChat, fetchAllChats, createGroup, updateGroupName, addMembers, removeMembers} = require("../controllers/chatController")

router.post('/', protected, accessChat)
router.get('/:id', protected, fetchAllChats)

router.post("/group",protected, createGroup)
router.put("/group", protected, updateGroupName)
router.put("/group/addmembers",protected, addMembers)
router.put("/group/remmembers",protected, removeMembers)

module.exports = router;