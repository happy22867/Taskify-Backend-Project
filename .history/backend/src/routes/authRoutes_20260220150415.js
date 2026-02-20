const router = require("express").Router();
const { register, login } = require("../controllers/authController");
import { body } from "express-validator";


export const registerValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 })
];

router.post("/register", register);
router.post("/login", login);

module.exports = router;