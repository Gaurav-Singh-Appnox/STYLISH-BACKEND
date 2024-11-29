const express = require("express");
const router = express.Router();

const { login, signUp, forgotPassword } = require("../controllers/Auth");

// login
router.post("/login", login);

//Route  signup
router.post("/signup", signUp);

router.post("/forgotPassword")

module.exports = router;
