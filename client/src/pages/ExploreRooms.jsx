import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import { useNavigate } from "react-router-dom";
import ScrollScaleCard from "../components/ScrollScaleCard";
import { motion, AnimatePresence } from "framer-motion";

const ExploreRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const navigate = useNavigate();

  /* --------------------------------
   📥 Fetch Rooms from API
  -------------------------------- */
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms`);
        const data = await res.json();
        setRooms(data || []);
        setFilteredRooms(data || []);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  /* --------------------------------
   🧠 Categories and Subcategories
  -------------------------------- */
  const categories = {
    Villas: ["Two Beach Front Villa", "Three Beach Front Villa"],
    Suites: [
      "Beachfront Junior Suite",
      "Beachfront Junior Suite with Pool",
      "Beachfront Executive Suite",
      "Beachfront Executive Suite with Pool",
      "Manorhouse Junior Suite",
      "Manorhouse Junior Suite with Pool",
      "Manorhouse Executive Suite",
      "Manorhouse Executive Suite with Pool",
    ],
    Rooms: [
      "Beachfront Premier Room",
      "Beachfront Junior Room",
      "Manorhouse Premier Room",
      "Manorhouse Junior Room",
    ],
  };

  /* --------------------------------
   🧩 Filter Logic
  -------------------------------- */
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredRooms(rooms);
      return;
    }

    if (selectedSubcategory === "All") {
      setFilteredRooms(
        rooms.filter((room) =>
          room.category?.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
    } else {
      setFilteredRooms(
        rooms.filter(
          (room) =>
            room.category?.toLowerCase().includes(selectedCategory.toLowerCase()) &&
            room.subCategory?.toLowerCase() === selectedSubcategory.toLowerCase()
        )
      );
    }
  }, [selectedCategory, selectedSubcategory, rooms]);

  /* --------------------------------
   🌀 Loading State
  -------------------------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-gray-600 text-lg font-medium">Loading rooms...</p>
      </div>
    );
  }

  /* --------------------------------
   ✨ UI Render
  -------------------------------- */
  return (
    <div className="lg:px-16 px-6 pt-[220px] pb-[180px] bg-[#fafafa] min-h-screen relative">
      {/* --- 🔹 Hover Sub-Navbar --- */}
      <AnimatePresence>
        {hoveredRoom && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-[90px] left-0 w-full bg-white border-t border-b border-black z-[60] px-12 py-3 flex justify-between items-center"
          >
            <h3 className="text-2xl font-semibold tracking-tight">
              {hoveredRoom.name}
            </h3>
            <p className="text-lg text-gray-700 font-medium max-w-[50%] text-center">
              {hoveredRoom.description
                ? hoveredRoom.description.slice(0, 80) + "..."
                : hoveredRoom.subCategory}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              ₹{hoveredRoom.pricePerNight}/night
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADING --- */}
      <div className="mb-10 text-left">
        <h2 className="font-[font2] lg:text-[9vw] text-6xl uppercase leading-none">
          Explore Stays
        </h2>
      </div>

      {/* --- FILTER CONTROLS --- */}
      <div className="flex flex-wrap gap-6 mb-16 items-center">
        {/* Category Select */}
        <div>
          <label className="block text-sm font-semibold mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory("All");
            }}
            className="border border-gray-400 px-4 py-2 rounded-md bg-white focus:outline-none"
          >
            <option value="All">All</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Select */}
        <div>
          <label className="block text-sm font-semibold mb-1">Subcategory</label>
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="border border-gray-400 px-4 py-2 rounded-md bg-white focus:outline-none"
          >
            <option value="All">All</option>
            {selectedCategory !== "All" &&
              categories[selectedCategory]?.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* --- ROOM GRID --- */}
      {filteredRooms.length > 0 ? (
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-10">
          {filteredRooms.map((room) => (
            <div
              key={room._id}
              className="w-full cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]"
              onMouseEnter={() => setHoveredRoom(room)}
              onMouseLeave={() => setHoveredRoom(null)}
              onClick={() => navigate(`/rooms/${room._id}`)}
            >
              <ScrollScaleCard room={room} navigate={navigate} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-20">
          No rooms found for this selection.
        </p>
      )}
    </div>
  );
};

export default ExploreRooms;
