import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Booked", "CheckedIn", "Completed", "Cancelled"],
      default: "Pending", // 🔸 pending = added to cart but not confirmed yet
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
