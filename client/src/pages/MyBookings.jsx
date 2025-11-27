import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API_BASE_URL from "../api";
import roomImages from "../assets/roomImages";

const DEFAULT_IMG = "/images2/default-room.jpg";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setBookings(data);
      } else {
        toast.error(data.error || "Failed to load bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Error loading bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/cancel/${bookingId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Booking cancelled ✅");
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "Cancelled" } : b
          )
        );
      } else {
        toast.error(data.msg || "Failed to cancel");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // 📱 Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black mb-4"></div>
          <p className="text-gray-600 font-medium text-sm">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  // 📱 Empty State
  if (!bookings.length) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 text-6xl">📭</div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
          No bookings yet
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto">
          Start your journey by exploring our amazing rooms and games. Your next
          adventure awaits!
        </p>
        <button
          onClick={() => navigate("/rooms")}
          className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
        >
          Explore Rooms
        </button>
      </div>
    );
  }

  // 📱 Bookings List
  return (
    <div className="min-h-screen bg-white pt-[90px] pb-12 px-4 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 flex justify-center sm:justify-start items-center gap-2">
            My Bookings <span className="text-2xl">🎫</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage and track all your reservations
          </p>
        </div>

        {/* Booking Cards */}
        <div className="flex flex-col gap-6">
          {bookings.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-black px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
                  <div className="bg-white/10 px-2.5 py-1 rounded-lg">
                    <p className="text-white text-xs sm:text-sm font-semibold">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    {new Date(order.createdAt || Date.now()).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
                <span
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold ${
                    order.status === "Booked"
                      ? "bg-green-500 text-white"
                      : order.status === "Cancelled"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6">
                <div className="space-y-5">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((it, idx) => {
                      const isGame = it.type === "game";
                      const imageUrl = it.thumbnail || DEFAULT_IMG;

                      return (
                        <div
                          key={idx}
                          className={`flex flex-col sm:flex-row sm:items-start gap-4 pb-4 ${
                            idx < order.items.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                        >
                          {/* Image */}
                          <div className="relative flex-shrink-0">
                            <div className="h-28 w-full sm:w-32 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                              <img
                                src={imageUrl}
                                alt={it.title}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.target.src = DEFAULT_IMG)}
                                loading="lazy"
                              />
                            </div>
                            <div className="absolute top-2 left-2 bg-white/90 rounded-md px-2 py-1 text-sm shadow">
                              {isGame ? "🎮" : "🏨"}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate mb-1">
                              {it.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {isGame ? "Game" : "Room"}
                              </span>
                              {it.meta?.category && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                  {it.meta.category}
                                </span>
                              )}
                            </div>
                            {it.startDate && (
                              <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <span>
                                  {new Date(it.startDate).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric" }
                                  )}
                                  {it.endDate && (
                                    <>
                                      {" → "}
                                      {new Date(
                                        it.endDate
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </>
                                  )}
                                </span>
                              </p>
                            )}
                          </div>

                          {/* Price */}
                          <div className="text-left sm:text-right">
                            <p className="text-base sm:text-xl font-bold text-gray-900">
                              ₹{it.price?.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              per {isGame ? "hour" : "night"}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="h-28 w-full sm:w-32 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <img
                          src={roomImages[order.roomType?.name] || DEFAULT_IMG}
                          alt={order.roomType?.name || "Room"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                          {order.roomType?.name || "Room"}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">
                          {order.roomType?.category}{" "}
                          {order.roomType?.subCategory &&
                            `• ${order.roomType.subCategory}`}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{order.totalAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-center sm:text-left">
                    <span className="text-gray-600 text-sm font-medium">
                      Total:
                    </span>{" "}
                    <span className="text-xl sm:text-2xl font-bold text-black">
                      ₹{order.totalAmount?.toLocaleString()}
                    </span>
                  </div>

                  {order.status === "Booked" && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm rounded-lg transition-all"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
