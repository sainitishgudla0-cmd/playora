// src/pages/hotelCustomer/Profile.jsx
import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully 👋");
    navigate("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm sm:text-base px-4">
        Loading your profile...
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-center text-sm sm:text-base px-4">
        No profile data found.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-10 sm:py-16 px-5 sm:px-6 bg-white rounded-2xl shadow-lg mt-24 sm:mt-20 border border-gray-100 text-gray-800">
      <h1 className="text-2xl sm:text-3xl font-bileha mb-6 text-center">
        Your Profile
      </h1>

      <div className="space-y-5 sm:space-y-6">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Name</p>
          <p className="text-lg sm:text-xl font-semibold break-words">
            {user.name}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Email</p>
          <p className="text-lg sm:text-xl font-semibold break-words">
            {user.email}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Phone</p>
          <p className="text-lg sm:text-xl font-semibold">
            {user.phone || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Joined On</p>
          <p className="text-lg sm:text-xl font-semibold">
            {new Date(user.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* ✅ Logout Button */}
      <div className="flex justify-center mt-8 sm:mt-10">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 sm:px-8 sm:py-2.5 rounded-xl transition shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
