import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import StarRating from "../components/StarRating";
import { assets, roomCommonData } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import BookingCalendar from "../components/BookingCalendar";
import { facilityIcons } from "../assets/facilityAssets";

import roomImg1 from "../assets/roomImg1.png";
import roomImg2 from "../assets/roomImg2.png";
import roomImg3 from "../assets/roomImg3.png";
import roomImg4 from "../assets/roomImg4.png";
import Testimonial from "../components/Testimonial";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(roomImg1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const galleryImages = [roomImg1, roomImg2, roomImg3, roomImg4];

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/id/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch room");
        setRoom(data);
      } catch (err) {
        console.error("Error fetching room details:", err);
        toast.error("Failed to load room");
      }
    };
    fetchRoom();
  }, [id]);

  // Hide navbar when cart is open
  useEffect(() => {
    const navbar = document.querySelector("nav, header, .navbar, .main-header, #navbar");
    if (navbar) {
      navbar.style.display = showCart ? "none" : "flex";
    }
  }, [showCart]);

  // Auto open cart when both dates selected
  useEffect(() => {
    if (checkInDate && checkOutDate) setShowCart(true);
  }, [checkInDate, checkOutDate]);

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = calculateNights(checkInDate, checkOutDate);
  const totalAmount = nights * (room?.pricePerNight || 0);

  const confirmCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select dates first");
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
          type: "room",
          refId: id,
          startDate: checkInDate,
          endDate: checkOutDate,
          guests,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Room added to cart 🛒");
        navigate("/cart");
      } else {
        toast.error(data.error || "Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (!room)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-700 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading room details...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white py-20 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 relative">
      <div className="max-w-7xl mx-auto">
        {/* ===== HEADER ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair text-black">
              {room.name}
            </h1>
            <motion.p whileHover={{ scale: 1.05 }} className="text-xs sm:text-sm font-bold py-2 px-4 text-white bg-black rounded-full shadow-md">
              🔥 20% OFF
            </motion.p>
          </div>

          <p className="text-xs sm:text-sm font-inter text-gray-600 mb-2 sm:mb-3">
            {room.category} {room.subCategory ? `• ${room.subCategory}` : ""}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-2">
            <StarRating key={`rating-${id}`} />
            <p className="text-xs sm:text-sm text-gray-600 font-medium">• 200+ reviews</p>
          </div>
        </motion.div>

        {/* ===== GALLERY ===== */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <motion.div className="lg:w-[60%] w-full" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.img
              key={mainImage}
              src={mainImage}
              alt="Main Room"
              className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          <div className="lg:w-[40%] w-full grid grid-cols-2 gap-4">
            {galleryImages.map((img, index) => (
              <motion.img
                key={index}
                src={img}
                alt={`Room ${index + 1}`}
                onClick={() => setMainImage(img)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full h-[150px] sm:h-[235px] rounded-2xl shadow-md object-cover cursor-pointer ${
                  mainImage === img ? "ring-2 ring-black ring-offset-1" : "hover:shadow-2xl opacity-90 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ===== DESCRIPTION ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair mb-6 text-black">
            Experience the Luxury Before You Arrive
          </h2>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-8">
            {room.description ||
              "Indulge in unparalleled luxury and comfort. Enjoy breathtaking views, modern design, and premium amenities — curated for an unforgettable stay."}
          </p>

          {/* AMENITIES */}
          <div className="mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Premium Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {(room.amenities?.length ? room.amenities : ["Wi-Fi", "AC", "TV", "Private Pool", "Bar", "Restaurant"]).map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <img src={facilityIcons[item] || assets.bedIcon} alt={item} className="w-6 sm:w-8 h-6 sm:h-8" />
                  <p className="text-[10px] sm:text-xs font-medium text-gray-700 text-center">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
            <span className="text-3xl sm:text-4xl">💰</span>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Starting from</p>
              <p className="text-2xl sm:text-3xl font-bold text-black">
                ₹{room.pricePerNight?.toLocaleString() || "N/A"}
                <span className="text-sm sm:text-lg text-gray-600 font-normal"> / night</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* ===== BOOKING CALENDAR ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-12 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-playfair mb-6 text-black">📅 Select Your Dates</h2>
          <BookingCalendar
            roomId={id}
            onConfirm={({ checkInDate, checkOutDate, adults, children }) => {
              setCheckInDate(checkInDate);
              setCheckOutDate(checkOutDate);
              setGuests(adults + children);
            }}
          />
        </motion.div>

        {/* ===== SPECIAL SECTION ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-12 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-playfair mb-8 text-black">What Makes Us Special</h2>
          <div className="space-y-6">
            {roomCommonData.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 10 }}
                className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl hover:bg-gray-50 transition-all"
              >
                <div className="p-2 sm:p-3 bg-gray-100 rounded-xl">
                  <img src={spec.icon} alt={spec.title} className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{spec.title}</p>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{spec.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Testimonial />
      </div>

      {/* ===== CART DRAWER ===== */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowCart(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="fixed right-0 top-0 w-full sm:w-[420px] h-full bg-white shadow-2xl z-50 flex flex-col overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b p-5 sticky top-0 bg-white z-10">
                <h2 className="text-base sm:text-lg font-semibold uppercase tracking-wide">Your Cart (1)</h2>
                <button onClick={() => setShowCart(false)} className="text-3xl hover:opacity-60 leading-none">
                  &times;
                </button>
              </div>

              {/* Item */}
              <div className="flex-1 overflow-y-auto border-b">
                <div className="flex p-5 border-b flex-col sm:flex-row">
                  <img src={mainImage} alt="room" className="w-full sm:w-24 h-48 sm:h-32 object-cover rounded-md" />
                  <div className="mt-3 sm:mt-0 sm:ml-4 flex-1">
                    <h3 className="text-base font-medium">{room.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Check-in: {checkInDate}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Check-out: {checkOutDate}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <button className="border px-3 py-1 text-sm">-</button>
                      <span className="text-sm">{guests}</span>
                      <button className="border px-3 py-1 text-sm">+</button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-800 font-semibold mt-3 sm:mt-0">
                    ₹{room.pricePerNight?.toLocaleString()}
                  </div>
                </div>

                {/* Total */}
                <div className="p-6 text-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total Bill</span>
                    <span className="font-semibold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-gray-500 text-xs">Taxes calculated at checkout</p>
                </div>
              </div>

              {/* Checkout */}
              <div className="p-6 sticky bottom-0 bg-white shadow-inner">
                <button
                  onClick={confirmCheckout}
                  className="w-full bg-black text-white py-3 text-sm font-semibold uppercase tracking-wide hover:bg-gray-800 transition"
                >
                  Checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomDetails;
