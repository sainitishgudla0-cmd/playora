// checkSeed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { exec as _exec } from "child_process";
import { promisify } from "util";
import RoomType from "./models/RoomType.js";
import Game from "./models/gameModel.js";

dotenv.config();
const exec = promisify(_exec);

async function run() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected (checkSeed)");

    const [roomCount, gameCount] = await Promise.all([
      RoomType.countDocuments(),
      Game.countDocuments(),
    ]);

    if (roomCount === 0) {
      console.log("🌱 Seeding rooms (collection empty)...");
      await exec("node seedRooms.js");
      console.log("✅ Rooms seeded.");
    } else {
      console.log(`ℹ️ Rooms already present: ${roomCount} docs. Skipping.`);
    }

    if (gameCount === 0) {
      console.log("🌱 Seeding games (collection empty)...");
      await exec("node seedGames.js");
      console.log("✅ Games seeded.");
    } else {
      console.log(`ℹ️ Games already present: ${gameCount} docs. Skipping.`);
    }
  } catch (err) {
    console.error("❌ checkSeed error:", err?.stderr || err?.message || err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 MongoDB connection closed (checkSeed)");
  }
}

run();
