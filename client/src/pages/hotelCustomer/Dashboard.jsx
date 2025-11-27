import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const DEFAULT_IMG = "/images2/default-room.jpg";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return toast.error("Please log in first");
        }
        const res = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setBookings(Array.isArray(data) ? data : []);
        } else {
          toast.error(data.error || "Failed to load bookings");
        }
      } catch (e) {
        console.error(e);
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  };

  // ---------- Helpers ----------
  const parseSlot = (slot) => {
    if (!slot || typeof slot !== "string") return null;
    const sep = slot.includes("–") ? "–" : slot.includes("-") ? "-" : null;
    if (!sep) return null;
    const [a, b] = slot.split(sep).map((s) => s.trim());
    const [h1, m1] = a.split(":").map((n) => parseInt(n, 10));
    const [h2, m2] = b.split(":").map((n) => parseInt(n, 10));
    if ([h1, m1, h2, m2].some((n) => Number.isNaN(n))) return null;
    return [[h1, m1], [h2, m2]];
  };

  const getItemWindowMs = (order, item) => {
    const HOUR = 60 * 60 * 1000;

    if (item.type === "room" && item.startDate && item.endDate) {
      const s = new Date(item.startDate).getTime();
      const e = new Date(item.endDate).getTime();
      if (Number.isFinite(s) && Number.isFinite(e)) return { start: s, end: e };
    }

    if (item.type === "game" && item.startDate) {
      const base = new Date(item.startDate);
      const y = base.getUTCFullYear();
      const m = base.getUTCMonth();
      const d = base.getUTCDate();

      const slot = parseSlot(item.meta?.slot || "");
      if (slot) {
        const [[sh, sm], [eh, em]] = slot;
        const startLocal = new Date(y, m, d, sh, sm, 0, 0).getTime();
        let endLocal = new Date(y, m, d, eh, em, 0, 0).getTime();
        if (endLocal <= startLocal) endLocal += 24 * HOUR;
        return { start: startLocal, end: endLocal };
      }

      const s = new Date(y, m, d, 0, 0, 0, 0).getTime();
      return { start: s, end: s + HOUR };
    }

    if (item.startDate) {
      const s = new Date(item.startDate).getTime();
      if (Number.isFinite(s)) return { start: s, end: s + HOUR };
    }
    const created = new Date(order.createdAt).getTime();
    return { start: created, end: created + HOUR };
  };

  // ---------- Classification ----------
  const now = Date.now();
  const activeBookings = [];
  const upcomingBookings = [];
  const pastBookings = [];

  bookings.forEach((order) => {
    order.items?.forEach((item, idx) => {
      const { start, end } = getItemWindowMs(order, item);
      if (order.status === "Cancelled") {
        pastBookings.push({ order, item, idx });
      } else if (now >= start && now <= end) {
        activeBookings.push({ order, item, idx });
      } else if (start > now) {
        upcomingBookings.push({ order, item, idx });
      } else if (end < now) {
        pastBookings.push({ order, item, idx });
      }
    });
  });

  // ---------- Cancel Booking ----------
  const handleCancel = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Please log in first");
      const res = await fetch(`${API_BASE_URL}/bookings/cancel/${bookingId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Booking cancelled");
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: "Cancelled" } : b))
        );
      } else {
        toast.error(data.msg || "Failed to cancel booking");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  // ---------- Booking Card ----------
  const BookingCard = ({ order, item, idx }) => {
    const shortId = order._id?.slice(-6).toUpperCase();
    const isRoom = item.type === "room";
    const { start, end } = getItemWindowMs(order, item);
    const canCancel = order.status === "Booked" && start > Date.now();

    return (
      <motion.div
        key={`${order._id}-${idx}`}
        className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative overflow-hidden group">
          <img
            src={item.thumbnail || DEFAULT_IMG}
            alt={item.title}
            className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => (e.currentTarget.src = DEFAULT_IMG)}
          />
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full ${
                order.status === "Booked"
                  ? "bg-green-500 text-white"
                  : order.status === "Cancelled"
                  ? "bg-red-500 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              #{shortId}
            </span>
            {canCancel && (
              <button
                onClick={() => handleCancel(order._id)}
                className="text-xs text-red-600 font-bold hover:text-red-700 underline"
              >
                Cancel
              </button>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {item.title}
          </h2>
          <p className="text-gray-500 text-sm capitalize mb-3">{item.type}</p>

          <div className="bg-gray-50 rounded-xl p-3 mb-3 border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-700 mb-1">
              <span className="font-semibold text-gray-900">Booked:</span>{" "}
              {formatDateTime(order.createdAt)}
            </p>

            {isRoom ? (
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Stay:</span>{" "}
                {new Date(start).toDateString()} → {new Date(end).toDateString()}
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Time:</span>{" "}
                {new Date(start).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}{" "}
                →{" "}
                {new Date(end).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200">
            <span className="font-bold text-blue-600 text-lg sm:text-xl">
              ₹{Number(item.price || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-200 border-t-sky-600 mb-3"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 pt-28 sm:pt-32 pb-10 sm:pb-12">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 px-4"
      >
        <h1 className="text-3xl sm:text-5xl font-bileha bg-clip-text text-transparent bg-gradient-to-r from-sky-700 via-blue-600 to-sky-800 mb-2">
          Your Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-lg">
          Manage your bookings and track your activities
        </p>
      </motion.div>

      {/* STATUS CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 px-4">
        {[
          {
            label: "Completed",
            count: pastBookings.length,
            color: "from-green-500 to-green-600",
          },
          {
            label: "Active",
            count: activeBookings.length,
            color: "from-sky-500 to-blue-600",
          },
          {
            label: "Total Spent",
            count: `₹${bookings
              .reduce((s, o) => s + (Number(o.totalAmount) || 0), 0)
              .toLocaleString()}`,
            color: "from-amber-500 to-orange-600",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className={`bg-gradient-to-br ${card.color} shadow-lg rounded-3xl p-6 sm:p-8 text-white flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300`}
          >
            <h3 className="text-sm sm:text-base mb-2 uppercase tracking-wider font-semibold opacity-90">
              {card.label}
            </h3>
            <p className="text-3xl sm:text-5xl font-extrabold text-center">
              {card.count}
            </p>
          </motion.div>
        ))}
      </div>

      {/* BOOKINGS SECTIONS */}
      {[{ label: "Active Bookings", data: activeBookings },
        { label: "Upcoming Bookings", data: upcomingBookings },
        { label: "Past Bookings", data: pastBookings }]
        .filter((sec) => sec.data.length > 0)
        .map((sec, i) => (
          <section key={i} className="max-w-6xl mx-auto mb-12 px-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 sm:mb-6"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {sec.label}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                {i === 0
                  ? "Currently active bookings"
                  : i === 1
                  ? "Upcoming scheduled plans"
                  : "Previous and completed bookings"}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sec.data.map(({ order, item }, idx) => (
                <BookingCard
                  key={`${order._id}-${sec.label}-${idx}`}
                  order={order}
                  item={item}
                  idx={idx}
                />
              ))}
            </div>
          </section>
        ))}

      {/* EMPTY STATE */}
      {!activeBookings.length && !upcomingBookings.length && !pastBookings.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mt-24 px-4"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            No Bookings Yet
          </h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-lg">
            Start exploring and make your first booking!
          </p>
          <button
            onClick={() => (window.location.href = "/rooms")}
            className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Explore Rooms
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
