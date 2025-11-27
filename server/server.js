// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Load env variables
dotenv.config();

const app = express();

// =========================
// ✅ CORS CONFIG (IMPORTANT)
// =========================
app.use(
  cors({
    origin: [
      "http://localhost:5173",          // local frontend
      "https://playora.vercel.app"      // deployed frontend
    ],
    credentials: true,
  })
);

app.use(express.json());

// Static file serving
app.use("/uploads", express.static("uploads"));

// =========================
// ✅ ROUTE IMPORTS
// =========================
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import { verifyToken } from "./middleware/authMiddleware.js";

// =========================
// ✅ REGISTER ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/orders", orderRoutes);

console.log("✅ API routes registered");

// Root route
app.get("/", (req, res) => res.send("Backend is running 🚀"));

// Protected route example
app.get("/api/protected", verifyToken, (req, res) =>
  res.json({ msg: `Welcome, user ${req.user.id}. Token verified ✅` })
);

// Simple test route
app.get("/api/test", (req, res) => {
  res.json({ msg: "✅ Test route working" });
});

// =========================
// ✅ MONGO DB CONNECTION
// =========================
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ Missing MONGO_URI in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// =========================
// ✅ START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
