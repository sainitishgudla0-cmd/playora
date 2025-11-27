import React from "react";
import roomImages from "../assets/roomImages";

const ScrollScaleCard = ({ room, navigate }) => {
  return (
    <div
      className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[550px] group overflow-hidden rounded-none hover:rounded-[70px] transition-all duration-500 bg-[#e5e5e5] cursor-pointer"
      onClick={() => navigate(`/rooms/${room._id}`)}
    >
      {/* Room Image */}
      <img
        src={roomImages[room.name] || "/default-room.jpg"}
        alt={room.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          e.target.src = "/default-room.jpg";
        }}
      />

      {/* ===== Overlay (Desktop hover / Mobile always visible) ===== */}
      <div
        className="
          absolute inset-0 flex flex-col items-center justify-center 
          bg-black/20 transition-opacity duration-500
          group-hover:opacity-100 
          sm:opacity-0 sm:group-hover:opacity-100 
          opacity-100 sm:opacity-0
        "
      >
        <h2
          className="
            uppercase text-2xl sm:text-4xl md:text-5xl lg:text-6xl 
            font-[font1] border-2 sm:border-4 pt-3 sm:pt-4 px-6 sm:px-8 
            text-white border-white rounded-full 
            shadow-lg text-center
          "
        >
          View Room
        </h2>
      </div>

      {/* ===== Room Info ===== */}
      <div
        className="
          absolute bottom-4 left-4 sm:bottom-6 sm:left-6 
          text-white drop-shadow-lg z-10
        "
      >
        <h3
          className="
            text-lg sm:text-2xl font-semibold uppercase 
            tracking-wide mb-1 leading-tight
          "
        >
          {room.name}
        </h3>
        <p className="text-sm sm:text-base opacity-90">
          ₹{room.pricePerNight?.toLocaleString()} / night
        </p>
      </div>

      {/* Subtle gradient for readability */}
      <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
    </div>
  );
};

export default ScrollScaleCard;
