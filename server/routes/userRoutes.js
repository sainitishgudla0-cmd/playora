import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getUserData,
  storeRecentSearchedCities,
  updateProfile, // ✅ added controller import
} from "../controllers/userController.js";

const router = express.Router();

// ✅ Get logged-in user info
// GET /api/users/me
router.get("/me", verifyToken, getUserData);

// ✅ Store user's recently searched cities (max 3)
// POST /api/users/recent-searched-cities
router.post("/recent-searched-cities", verifyToken, storeRecentSearchedCities);

// ✅ Update user profile (name, email, password)
// PUT /api/users/update-profile
router.put("/update-profile", verifyToken, updateProfile);

export default router;
