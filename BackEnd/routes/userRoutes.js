const express = require("express")
const {registerUser, authUser, searchUser, checkEmailExists} = require("../controllers/userController")
const router = express.Router()
const protected = require('../middleware/authMiddleware')


router.get("/", protected, searchUser);
router.post("/register",registerUser);
router.post("/login",authUser)
router.get('/:id',checkEmailExists)

module.exports = router