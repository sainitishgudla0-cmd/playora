import Game from "../models/gameModel.js";
import path from "path";
import fs from "fs";

// 🟢 Upload Game
export const uploadGame = async (req, res) => {
  try {
    const { title, category, description, price, isFeatured } = req.body;

    // File upload info
    const fileUrl = req.file ? `/uploads/games/${req.file.filename}` : null;

    const game = new Game({
      title,
      category,
      description,
      price,
      isFeatured,
      fileUrl,
    });

    await game.save();
    res.status(201).json({ message: "Game uploaded successfully", game });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟣 Get All Games
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch games" });
  }
};

// 🔵 Get Single Game by ID
export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: "Error fetching game" });
  }
};

// 🔴 Delete Game
export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });

    await game.deleteOne();
    res.json({ message: "Game deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
