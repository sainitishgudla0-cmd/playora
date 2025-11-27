import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    // "room" | "game"
    type: { type: String, enum: ["room", "game"], required: true },

    // RoomType._id or Game._id
    refId: { type: mongoose.Schema.Types.ObjectId, required: true },

    // For fast display (denormalized)
    title: { type: String, required: true },
    thumbnail: { type: String },

    // Price and quantity
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },

    // Dates (rooms: check-in/out; games: date in startDate, end optional)
    startDate: { type: Date },
    endDate: { type: Date },

    // Flexible metadata (guests, slot "HH:MM–HH:MM", categories, etc.)
    meta: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [itemSchema],
    totalAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Booked", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);
