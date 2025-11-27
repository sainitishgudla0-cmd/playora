// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// ✅ Load env variables
dotenv.config();

const app = express();

// ✅ Middleware setup
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend (Vite)
    credentials: true,
  })
);
app.use(express.json());

// ✅ Static file serving
app.use("/uploads", express.static("uploads"));

// ✅ Routes imports
import authRoutes from "./routes/authRoutes.js";   // must contain /register + /login
import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// ✅ Middleware
import { verifyToken } from "./middleware/authMiddleware.js";

// ✅ Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
console.log("✅ /api/auth route attached");

// ✅ Root route (health check)
app.get("/", (req, res) => res.send("Backend is running 🚀"));

// ✅ Example protected route
app.get("/api/protected", verifyToken, (req, res) =>
  res.json({ msg: `Welcome, user ${req.user.id}. Token verified ✅` })
);

// ✅ Simple test route
app.get("/api/test", (req, res) => {
  res.json({ msg: "✅ Test route working" });
});

// ✅ Connect MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ Missing MONGO_URI in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Debug list of routes (after small delay)
setTimeout(() => {
  if (app._router && app._router.stack) {
    console.log("\n📜 Registered Routes:");
    app._router.stack.forEach((r) => {
      if (r.route && r.route.path) {
        console.log(`📦 ${r.route.path}`);
      } else if (r.name === "router") {
        r.handle.stack.forEach((handler) => {
          if (handler.route) {
            console.log(`📦 ${handler.route.path}`);
          }
        });
      }
    });
    console.log("");
  } else {
    console.log("⚠️ No routes found yet — check route imports.");
  }
}, 1500);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
