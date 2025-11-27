import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import RoomType from "../models/RoomType.js";
import Game from "../models/gameModel.js";

const router = express.Router();

/**
 * ➕ Add to cart (room or game)
 */
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { type, refId, startDate, endDate, guests, slot } = req.body;

    let item = null;
    if (type === "room") {
      const room = await RoomType.findById(refId);
      if (!room) return res.status(404).json({ error: "Room not found" });
      item = {
        type,
        refId,
        title: room.name,
        price: room.pricePerNight,
        startDate,
        endDate,
        thumbnail: room.image,
        meta: { guests },
      };
    } else if (type === "game") {
      const game = await Game.findById(refId);
      if (!game) return res.status(404).json({ error: "Game not found" });
      item = {
        type,
        refId,
        title: game.title,
        price: game.price,
        startDate,
        thumbnail: game.thumbnail,
        meta: { slot },
      };
    } else {
      return res.status(400).json({ error: "Invalid item type" });
    }

    let order = await Order.findOne({ user: req.user.id, status: "Pending" });
    if (!order) order = await Order.create({ user: req.user.id, items: [] });

    order.items.push(item);
    order.totalAmount = order.items.reduce((sum, i) => sum + i.price, 0);
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add item" });
  }
});

/**
 * 🛍️ Get current cart
 */
router.get("/cart", verifyToken, async (req, res) => {
  const order = await Order.findOne({ user: req.user.id, status: "Pending" });
  res.json(order || { items: [] });
});

/**
 * ✅ Confirm booking (checkout)
 */
router.post("/checkout", verifyToken, async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { user: req.user.id, status: "Pending" },
    { status: "Booked" },
    { new: true }
  );
  res.json(order);
});

/**
 * 📋 Get all past orders (Dashboard)
 */
router.get("/my-orders", verifyToken, async (req, res) => {
  const orders = await Order.find({ user: req.user.id, status: { $ne: "Pending" } }).sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
