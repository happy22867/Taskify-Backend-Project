const router = require("express").Router();
const { register, login } = require("../controllers/authController");
const { body } = require("express-validator");


const registerValidation = [
  body("name").notEmpty().withMessage("Name required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 5 }).withMessage("Min 5 chars password")
];

// routes
router.post("/register", registerValidation, register);
router.post("/login", login);

module.exports = router;