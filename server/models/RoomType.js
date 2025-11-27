import mongoose from "mongoose";

const bookedRangeSchema = new mongoose.Schema(
  {
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
  },
  { _id: false }
);

const roomTypeSchema = new mongoose.Schema(
  {
    // Basics
    name: { type: String, required: true },
    category: { type: String },
    subCategory: { type: String },
    description: { type: String },
    image: { type: String },
    thumbnail: { type: String },
    pricePerNight: { type: Number, required: true },

    // Stock
    availableRooms: { type: Number, default: 1 },

    // Amenities
    amenities: [{ type: String }],

    // 🔒 Booked date ranges
    bookedDates: {
      type: [bookedRangeSchema],
      default: [],              // ← ensures array always exists
    },
  },
  { timestamps: true }
);

export default mongoose.model("RoomType", roomTypeSchema);
