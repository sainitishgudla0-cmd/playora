// seedGames.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Game from "./models/gameModel.js";

dotenv.config();

const games = [
  {
    title: "Golf",
    category: "Outdoor",
    description: "Golf per hour",
    price: 500,
    thumbnail: "/images2/golf-1938932_1920.jpg", // ✅ local public path
  },
  {
    title: "Football",
    category: "Outdoor",
    description: "Football per hour",
    price: 500,
    thumbnail: "/images2/football.jpg",
  },
  {
    title: "Turf",
    category: "Outdoor",
    description: "Turf per hour",
    price: 850,
    thumbnail: "/images2/turf.jpg",
  },
  {
    title: "VR Gaming",
    category: "Indoor",
    description: "VR Gaming per hour",
    price: 1200,
    thumbnail: "/images2/virtual-reality-7019022.jpg",
  },
  {
    title: "Bowling",
    category: "Indoor",
    description: "Bowling per hour",
    price: 1000,
    thumbnail: "/images2/bowling-424776.jpg",
  },
  {
    title: "Go Karting",
    category: "Outdoor",
    description: "Go Karting per hour",
    price: 800,
    thumbnail: "/images2/kart-1754533_1920.jpg",
  },
];

const seedGames = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected (games)");
    await Game.deleteMany();
    await Game.insertMany(games);
    console.log(`✅ Games added successfully: ${games.length}`);
    await mongoose.connection.close();
    console.log("🔒 Connection closed (games)");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding games:", error);
    process.exit(1);
  }
};

seedGames();
