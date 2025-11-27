import RoomType from "../models/RoomType.js";

/**
 * Add a new room type (protected)
 */
export const addRoomType = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      name,
      description,
      image,
      pricePerNight,
      availableRooms,
    } = req.body;

    const room = await RoomType.create({
      category,
      subCategory,
      name,
      description,
      image,
      pricePerNight,
      availableRooms,
    });

    res.status(201).json({ msg: "Room type added successfully", room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all room types (public)
 */
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await RoomType.find();
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get rooms by category (Villas, Suites, Rooms, etc.)
 */
export const getRoomsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const rooms = await RoomType.find({ category });
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ✅ Get single room by ID (public)
 */
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomType.findById(id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
