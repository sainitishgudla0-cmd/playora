import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in first");
          console.log("🚫 No token found in localStorage");
          return;
        }

        console.log("📡 Fetching bookings from:", `${API_BASE_URL}/bookings/my-bookings`);

        const res = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("✅ Response:", data);

        if (res.ok) {
          setBookings(data);
        } else {
          toast.error(data.error || "Failed to load bookings");
        }
      } catch (err) {
        console.error("❌ Error fetching:", err);
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-6">
      <h1 className="text-4xl font-bileha text-center mb-10">Your Dashboard</h1>


      {bookings.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>No bookings yet. Start exploring our rooms and games!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {bookings.map((order) =>
            order.items?.map((item, idx) => (
              <motion.div
                key={`${order._id}-${idx}`}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border border-gray-100"
                whileHover={{ scale: 1.02 }}
              >
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {item.title}
                </h2>
                <p className="text-gray-500 text-sm capitalize mb-2">
                  Type: {item.type}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-semibold text-sky-700">
                    ₹{item.price?.toLocaleString()}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      order.status === "Booked"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
  