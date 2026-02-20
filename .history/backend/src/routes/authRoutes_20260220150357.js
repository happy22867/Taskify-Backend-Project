const router = require("express").Router();
const { register, login } = require("../controllers/authController");
import { body } from "express-validator";

router.post("/register", register);
router.post("/login", login);

module.exports = router;