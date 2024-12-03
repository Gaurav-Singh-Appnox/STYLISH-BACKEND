const express = require("express");
const router = express.Router();

const { login, signUp, editUserDetail } = require("../controllers/Auth");
const { authMiddleware } = require("../middlewares/auth");

// login
router.post("/login", login);

//Route  signup
router.post("/signup", signUp);

// route forgot password
router.post("/forgotPassword");

// edit user detail

router.post("/editUser", authMiddleware, editUserDetail);

module.exports = router;
