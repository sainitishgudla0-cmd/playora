import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true }, // e.g. 'Arcade', 'Sports', etc.
    description: { type: String },
    price: { type: Number, default: 0 },
    thumbnail: { type: String, required: true }, // ✅ image URL (local or cloud)
    fileUrl: { type: String },                   // for VR games or downloads
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Game", gameSchema);
