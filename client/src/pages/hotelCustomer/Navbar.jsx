// src/components/Navbar/Navbar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../api";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  // ✅ Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.name) {
          setUserName(data.name);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    if (isLoggedIn) fetchUser();
  }, [isLoggedIn]);

  // ✅ Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/95 backdrop-blur-lg shadow-2xl py-2 sm:py-3"
          : "bg-gradient-to-r from-gray-900 via-black to-gray-900 py-3 sm:py-4 shadow-xl"
      }`}
      style={{ animation: "slideDown 0.5s ease-out" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-between items-center gap-3 sm:gap-0">
        {/* ✅ Left Logo */}
        <h1
          onClick={() => navigate("/")}
          className="font-bileha text-3xl sm:text-4xl cursor-pointer bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent hover:from-yellow-300 hover:via-yellow-200 hover:to-amber-300 transition-all duration-300 transform hover:scale-105 active:scale-95"
          style={{
            filter: "drop-shadow(0 4px 12px rgba(250, 204, 21, 0.4))",
          }}
        >
          Playora
        </h1>

        {/* ✅ Navigation Links */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6 text-sm sm:text-base">
          <NavLink
            to="/customer/dashboard"
            className={({ isActive }) =>
              `relative px-3 sm:px-5 py-2 sm:py-2.5 font-bold tracking-wide transition-all duration-300 rounded-lg group ${
                isActive
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline text-lg">📊</span>
                  Dashboard
                </span>
                {isActive && (
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg border border-yellow-500/40 animate-pulse"
                    style={{
                      boxShadow: "0 0 20px rgba(250, 204, 21, 0.3)",
                    }}
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 to-amber-500/0 group-hover:from-yellow-500/15 group-hover:to-amber-500/15 rounded-lg transition-all duration-300" />
              </>
            )}
          </NavLink>

          <NavLink
            to="/customer/contact"
            className={({ isActive }) =>
              `relative px-3 sm:px-5 py-2 sm:py-2.5 font-bold tracking-wide transition-all duration-300 rounded-lg group ${
                isActive
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline text-lg">📞</span>
                  Contact
                </span>
                {isActive && (
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg border border-yellow-500/40 animate-pulse"
                    style={{
                      boxShadow: "0 0 20px rgba(250, 204, 21, 0.3)",
                    }}
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 to-amber-500/0 group-hover:from-yellow-500/15 group-hover:to-amber-500/15 rounded-lg transition-all duration-300" />
              </>
            )}
          </NavLink>

          {/* ✅ Profile Button (visible when logged in) */}
          {isLoggedIn && (
            <button
              onClick={() => navigate("/customer/profile")}
              className="relative flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 text-black font-bold transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 overflow-hidden group transform hover:scale-105 hover:-translate-y-1 active:scale-95"
            >
              <span className="text-lg sm:text-xl relative z-10">👤</span>
              <span className="capitalize relative z-10 text-xs sm:text-sm tracking-wide">
                Hi, {userName ? userName.split(" ")[0] : "Guest"}!
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ✅ Bottom glow line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent transition-all duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          boxShadow: scrolled ? "0 0 10px rgba(250, 204, 21, 0.5)" : "none",
        }}
      />

      {/* ✅ CSS animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
