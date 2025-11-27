import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({ msg: "User registered successfully", user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });

    // if user not found
    if (!user) {
      return res.status(404).json({ msg: "User doesn't exist" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({ msg: "Login successful", token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
