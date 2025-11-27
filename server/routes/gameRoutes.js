import express from "express";
import { uploadGame, getAllGames, getGameById, deleteGame } from "../controllers/gameController.js";
import upload from "../middleware/uploadMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Upload Game (protected)
router.post("/upload", upload.single("file"), uploadGame);


// 🟣 Get All Games
router.get("/", getAllGames);

// 🔵 Get Single Game
router.get("/:id", getGameById);

// 🔴 Delete Game
router.delete("/:id", verifyToken, deleteGame);

export default router;
