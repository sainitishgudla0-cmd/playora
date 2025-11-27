import express from "express";
import {
  addRoomType,
  getAllRooms,
  getRoomsByCategory,
  getRoomById,
} from "../controllers/roomController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Add new room (protected)
 */
router.post("/add", verifyToken, addRoomType);

/**
 * Get all rooms (public)
 */
router.get("/", getAllRooms);

/**
 * ✅ Get single room by ID (public)
 * Example: GET /api/rooms/id/68ff4adeb221760dabaecfa2
 */
router.get("/id/:id", getRoomById);

/**
 * Get rooms by category (public)
 * Example: GET /api/rooms/Villas
 */
router.get("/:category", getRoomsByCategory);

export default router;
