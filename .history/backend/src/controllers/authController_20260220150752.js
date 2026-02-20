const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.register = async (req, res) => {
  try {
// validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    res.status(201).json({ msg: "User registered" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "All fields required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // (frontend ke liye)
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};