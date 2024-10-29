const express = require("express")
const {registerUser, authUser, searchUser} = require("../controllers/userController")
const router = express.Router()
const protected = require('../middleware/authMiddleware')


router.get("/", protected, searchUser);
router.post("/register",registerUser);
router.post("/login",authUser)

module.exports = router