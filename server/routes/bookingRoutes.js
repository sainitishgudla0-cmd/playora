import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getUserBookings,
  cancelBooking,
  addToCart,
  getCart,
  confirmBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// Create direct confirmed booking
router.post("/create", verifyToken, createBooking);

// Get all bookings for the logged-in user
router.get("/my-bookings", verifyToken, getUserBookings);

// Cancel a booking
router.put("/cancel/:bookingId", verifyToken, cancelBooking);

// 🛒 Add to Cart (Pending)
router.post("/add-to-cart", verifyToken, addToCart);

// 🛒 View Cart
router.get("/cart", verifyToken, getCart);

// 💳 Confirm (Proceed to Pay)
router.put("/confirm/:bookingId", verifyToken, confirmBooking);

export default router;
