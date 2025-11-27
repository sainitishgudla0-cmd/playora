import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import gameImages from "../assets/gameImages";

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/games/${id}`);
        const data = await res.json();
        setGame(data);
      } catch (err) {
        console.error("Error fetching game:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black mb-3"></div>
          <p className="text-gray-600 text-sm font-medium">Loading game...</p>
        </div>
      </div>
    );

  if (!game || game.error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4 px-4">
        <div className="text-6xl mb-2">🎮</div>
        <h2 className="text-2xl font-bold text-gray-800">Game not found</h2>
        <p className="text-gray-600 text-center text-sm">
          This game might have been removed or doesn't exist.
        </p>
        <button
          onClick={() => navigate("/games")}
          className="px-6 py-2.5 rounded-lg bg-black text-white font-semibold shadow-md hover:bg-gray-800 transition-all text-sm"
        >
          ← Back to Games
        </button>
      </div>
    );

  const imageSrc =
    game.thumbnail?.startsWith("http")
      ? game.thumbnail
      : gameImages[game.title] || "/images2/fallback.jpg";

  const handleConfirm = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!selectedDate || !startTime || !endTime) {
      toast.error("Please select date and timings");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "game",
          refId: id,
          startDate: selectedDate,
          slot: `${startTime}–${endTime}`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Game added to cart 🛒");
        setIsModalOpen(false);
        navigate("/cart");
      } else {
        toast.error(data.error || "Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const calculateDuration = () => {
    if (!startTime || !endTime) return null;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diff = (end - start) / (1000 * 60 * 60);
    return diff > 0 ? diff : null;
  };

  const duration = calculateDuration();

  return (
    <div className="min-h-screen bg-white pt-[80px] pb-12 px-4 sm:px-6 md:px-12">
      {/* Back Button */}
      <button
        onClick={() => navigate("/games")}
        className="flex items-center gap-1 text-gray-600 hover:text-black mb-5 text-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>

      {/* Game Details */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="relative">
          <img
            src={imageSrc}
            alt={game.title}
            className="w-full h-[260px] sm:h-[350px] object-cover"
            onError={(e) => (e.target.src = "/images2/fallback.jpg")}
          />
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 rounded-full text-xs font-bold text-gray-800 shadow">
            🎮 {game.category}
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{game.title}</h1>

          {game.players && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1.5 text-xs bg-gray-100 text-gray-800 font-semibold rounded-full">
                {game.players} Players
              </span>
              <span className="px-3 py-1.5 text-xs bg-gray-100 text-gray-800 font-semibold rounded-full">
                {game.category}
              </span>
            </div>
          )}

          {game.description && (
            <p className="text-gray-600 text-sm sm:text-base mb-5 leading-relaxed">
              {game.description}
            </p>
          )}

          {game.features && game.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-700">
                {game.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {game.pricePerHour && (
            <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-3xl font-bold text-black">
                ₹{game.pricePerHour}
              </span>
              <span className="text-gray-600 text-sm ml-1">per hour</span>
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 rounded-xl bg-black text-white font-semibold text-base shadow-md hover:bg-gray-800 transition-all"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-start sm:items-center overflow-y-auto py-6 sm:py-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-2xl relative mx-4 sm:mx-0 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-black px-5 py-4 text-white relative rounded-t-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-white hover:bg-white/20 rounded-full p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold">Book Session</h2>
              <p className="text-gray-300 text-xs">Select date & time</p>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Select Date</h3>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MMMM d, yyyy"
                    minDate={new Date()}
                    inline
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Select Time</h3>
                <div className="space-y-3">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-gray-300 outline-none"
                  />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-gray-300 outline-none"
                  />
                </div>
              </div>

              {duration && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-semibold">
                      {duration} {duration === 1 ? "hour" : "hours"}
                    </span>
                  </div>
                  {game.pricePerHour && (
                    <div className="flex justify-between mt-1 border-t border-gray-200 pt-2">
                      <span>Estimated Cost</span>
                      <span className="font-bold text-black">
                        ₹{(game.pricePerHour * duration).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleConfirm}
                className="w-full py-3 rounded-xl bg-black text-white font-semibold text-base shadow-md hover:bg-gray-800 transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GameDetails;
