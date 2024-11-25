const express = require("express");
const router = express.Router();

const { login, signUp } = require("../controllers/Auth");

// login
router.post("/login", login);

//Route  signup
router.post("/signup", signUp);

module.exports = router;
