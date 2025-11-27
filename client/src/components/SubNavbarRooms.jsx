import React, { useState, useEffect } from "react";
import API_BASE_URL from "../api";
import { motion, AnimatePresence } from "framer-motion";

const SubNavbarRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms`);
        const data = await res.json();
        setRooms(data);
        setActiveRoom(data[0]); // default first room
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="w-full bg-black text-white flex flex-col lg:flex-row justify-between items-stretch min-h-[400px]">
      {/* Left Sub-navbar list */}
      <div className="flex-1 flex flex-col justify-center">
        {rooms.map((room) => (
          <button
            key={room._id}
            onMouseEnter={() => setActiveRoom(room)}
            className={`text-left px-8 py-4 border-b border-gray-700 text-lg font-medium transition-colors duration-300 ${
              activeRoom?._id === room._id
                ? "bg-lime-400 text-black"
                : "hover:bg-gray-900"
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>

      {/* Right Image + Info preview */}
      <div className="flex-1 bg-black flex items-center justify-center p-6 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeRoom && (
            <motion.div
              key={activeRoom._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <img
                src={activeRoom.thumbnail || "/images2/default-room.jpg"}
                alt={activeRoom.name}
                className="w-full h-[380px] object-cover rounded-2xl mb-6"
              />
              <h3 className="text-2xl font-semibold mb-2">
                {activeRoom.name}
              </h3>
              <p className="text-gray-300">{activeRoom.subCategory}</p>
              <p className="text-xl text-lime-400 mt-2">
                ₹{activeRoom.pricePerNight}/night
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SubNavbarRooms;
