// server/routes/authRoutes.js
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// ✅ Debug: confirm load
console.log("✅ authRoutes loaded");

// ✅ Register route
router.post("/register", (req, res, next) => {
  console.log("📩 /register hit");
  next();
}, registerUser);

// ✅ Login route
router.post("/login", (req, res, next) => {
  console.log("📩 /login hit");
  next();
}, loginUser);

// ✅ Debug: confirm export type
console.log("✅ authRoutes exporting router:", typeof router);

export default router;
