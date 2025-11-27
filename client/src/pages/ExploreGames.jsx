import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import { useNavigate } from "react-router-dom";
import ScrollScaleGameCard from "../components/ScrollScaleGameCard";
import { motion, AnimatePresence } from "framer-motion";

const ExploreGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredGame, setHoveredGame] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/games`);
        const data = await res.json();
        setGames(data || []);
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-gray-600 text-lg font-medium">Loading games...</p>
      </div>
    );
  }

  return (
    <div className="lg:px-16 px-6 pt-[220px] pb-[200px] bg-[#fafafa] min-h-screen relative">
      {/* --- 🔹 Hover Sub-Navbar --- */}
      <AnimatePresence>
        {hoveredGame && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-[90px] left-0 w-full bg-white border-t border-b border-black z-[60] px-12 py-3 flex justify-between items-center"
          >
            <h3 className="text-2xl font-semibold tracking-tight">
              {hoveredGame.title}
            </h3>
            <p className="text-lg text-gray-700 font-medium max-w-[50%] text-center">
              {hoveredGame.description
                ? hoveredGame.description.slice(0, 80) + "..."
                : hoveredGame.category}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              ₹{hoveredGame.price}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADING --- */}
      <div className="mb-16 text-left">
        <h2 className="font-[font2] lg:text-[9vw] text-6xl uppercase leading-none">
          Games
        </h2>
      </div>

      {/* --- GAME GRID --- */}
      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-10 mb-[50px]">
        {games.map((game) => (
          <div
            key={game._id}
            className="w-full cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]"
            onMouseEnter={() => setHoveredGame(game)}
            onMouseLeave={() => setHoveredGame(null)}
            onClick={() => navigate(`/games/${game._id}`)}
          >
            <ScrollScaleGameCard game={game} navigate={navigate} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreGames;
