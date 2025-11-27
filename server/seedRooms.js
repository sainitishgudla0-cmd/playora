// seedRooms.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import RoomType from "./models/RoomType.js";

dotenv.config();

const rooms = [
  // --- Villas ---
  {
    category: "Villas",
    subCategory: "Beach Front Villa",
    name: "Two Bedroom Beachfront Villa",
    description: "Luxurious two-bedroom villa with direct beach access and private pool.",
    thumbnail: "/images/villa2bhk.jpg", // ✅ local public path
    pricePerNight: 1200,
    availableRooms: 1,
  },
  {
    category: "Villas",
    subCategory: "Beach Front Villa",
    name: "Three Bedroom Beachfront Villa",
    description: "Elegant three-bedroom beachfront villa with private pool and panoramic sea view.",
    thumbnail: "/images/villa3bhk.jpg",
    pricePerNight: 1600,
    availableRooms: 1,
  },

  // --- Suites (Beachfront) ---
  {
    category: "Suites",
    subCategory: "Beachfront Suites",
    name: "Beachfront Junior Suite",
    description: "Modern beachfront junior suite with ocean-view balcony.",
    thumbnail: "/images/beachfrontjuniorsuite.jpg",
    pricePerNight: 550,
    availableRooms: 1,
  },
  {
    category: "Suites",
    subCategory: "Beachfront Suites",
    name: "Beachfront Junior Suite with Pool",
    description: "Private plunge pool and large terrace overlooking the ocean.",
    thumbnail: "/images/beachfrontjuniorsuitewithpool.jpg",
    pricePerNight: 700,
    availableRooms: 1,
  },
  {
    category: "Suites",
    subCategory: "Beachfront Suites",
    name: "Beachfront Executive Suite",
    description: "Spacious executive suite with beachfront living area and luxurious amenities.",
    thumbnail: "/images/beachfrontexecutivesuite.jpg",
    pricePerNight: 850,
    availableRooms: 1,
  },
  {
    category: "Suites",
    subCategory: "Beachfront Suites",
    name: "Beachfront Executive Suite with Pool",
    description: "Exclusive executive suite with private pool and panoramic beach views.",
    thumbnail: "/images/beachfrontexecutivesuitewithpool.jpg",
    pricePerNight: 1000,
    availableRooms: 1,
  },

  // --- Suites (Manor House) ---
  {
    category: "Suites",
    subCategory: "Manor House Suites",
    name: "Manor House Junior Suite",
    description: "Classic manor-style suite with garden views and elegant interiors.",
    thumbnail: "/images/manorhousejuniorsuite.jpg",
    pricePerNight: 450,
    availableRooms: 1,
  },
  {
    category: "Suites",
    subCategory: "Manor House Suites",
    name: "Manor House Junior Suite with Pool",
    description: "Manor house junior suite featuring a private plunge pool.",
    thumbnail: "/images/manorhousejuniorsuitewithpool.jpg",
    pricePerNight: 600,
    availableRooms: 1,
  },
  {
    category: "Suites",
    subCategory: "Manor House Suites",
    name: "Manor House Executive Suite",
    description: "Elegant executive suite inside the manor with a private lounge and balcony.",
    thumbnail: "/images/manorhouseexecutivesuite.jpg",
    pricePerNight: 700,
    availableRooms: 1,
  },
  {
    category: "Suites",
    subCategory: "Manor House Suites",
    name: "Manor House Executive Suite with Pool",
    description: "Top-tier manor executive suite with private pool and garden access.",
    thumbnail: "/images/manorhouseexecutivesuitewithpool.jpg",
    pricePerNight: 850,
    availableRooms: 1,
  },

  // --- Rooms (Beachfront) ---
  {
    category: "Rooms",
    subCategory: "Beachfront Rooms",
    name: "Beachfront Premier Room",
    description: "Premium beachfront room offering direct sea view and balcony.",
    thumbnail: "/images/beachfrontroomspremier.jpg",
    pricePerNight: 350,
    availableRooms: 1,
  },
  {
    category: "Rooms",
    subCategory: "Beachfront Rooms",
    name: "Beachfront Junior Room",
    description: "Comfortable beachfront room with cozy interiors and ocean breeze.",
    thumbnail: "/images/beachfrontroomsjunior.jpg",
    pricePerNight: 300,
    availableRooms: 1,
  },

  // --- Rooms (Manor House) ---
  {
    category: "Rooms",
    subCategory: "Manor House Rooms",
    name: "Manor House Premier Room",
    description: "Elegant manor-style premier room with garden view.",
    thumbnail: "/images/manorhouseroomspremier.jpg",
    pricePerNight: 320,
    availableRooms: 1,
  },
  {
    category: "Rooms",
    subCategory: "Manor House Rooms",
    name: "Manor House Junior Room",
    description: "Classic junior room located in the manor building.",
    thumbnail: "/images/manorhouseroomsjunior.jpg",
    pricePerNight: 280,
    availableRooms: 1,
  },
];

const seedRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected (rooms)");

    await RoomType.deleteMany({});
    console.log("🧹 Cleared existing rooms");

    await RoomType.insertMany(rooms);
    console.log(`✅ Inserted ${rooms.length} rooms successfully`);

    await mongoose.connection.close();
    console.log("🔒 Connection closed (rooms)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding rooms:", err);
    process.exit(1);
  }
};

seedRooms();
