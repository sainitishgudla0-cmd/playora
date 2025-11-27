import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";

const DEFAULT_IMG = "/images2/default-room.jpg";

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch Cart
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/bookings/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setCartData(data);
        } else {
          toast.error(data.error || "Failed to load cart");
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
        toast.error("Unable to connect to server");
      }
    };
    fetchCart();
  }, [navigate]);

  // ✅ Confirm Checkout
  const handleProceedToPay = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/confirm/${cartData._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          toast.success("Payment Successful ✅");
          navigate("/my-bookings");
        }, 2000);
      } else {
        toast.error(data.msg || "Failed to confirm order");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while confirming");
    }
  };

  // ✅ Empty Cart
  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          No items in your cart 🛒
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          Add rooms or games from the Explore pages.
        </p>
        <button
          onClick={() => navigate("/rooms")}
          className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md text-sm font-semibold transition-all"
        >
          Explore Rooms
        </button>
      </div>
    );
  }

  const subtotal =
    cartData.totalAmount ||
    cartData.items.reduce((s, i) => s + (i.price || 0), 0);

  return (
    <div className="pt-[90px] pb-12 px-4 sm:px-6 md:px-10 lg:px-16 bg-white min-h-screen relative">
      {/* ✅ Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-6 text-center w-[90%] sm:w-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-600 mb-2">
              Payment Successful ✅
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Redirecting to your bookings...
            </p>
          </div>
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair mb-6 sm:mb-8 flex items-center gap-2">
        Your Cart <span className="text-xl sm:text-2xl">🛒</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          {cartData.items.map((item, i) => {
            const isGame = item.type === "game";
            const imageUrl = item.thumbnail || DEFAULT_IMG;

            return (
              <div
                key={`${item.refId}-${i}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* LEFT: Image + Info */}
                <div className="flex items-start gap-4 w-full sm:w-auto">
                  <div className="h-20 w-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={item.title || item.roomType?.name || "Item"}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = DEFAULT_IMG)}
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-col">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-1">
                      {isGame ? "🎮" : "🏨"}{" "}
                      {item.title || item.roomType?.name || "Item"}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 capitalize">
                      {isGame ? "Game" : "Room"}{" "}
                      {item.meta?.category
                        ? `• ${item.meta.category}`
                        : item.roomType?.category
                        ? `• ${item.roomType.category}`
                        : ""}
                    </p>
                    {item.startDate && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {new Date(item.startDate).toDateString()}
                        {item.endDate
                          ? ` → ${new Date(item.endDate).toDateString()}`
                          : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT: Price */}
                <div className="text-right sm:ml-auto">
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    ₹{item.price?.toLocaleString() || "N/A"}
                  </p>
                  <p className="text-xs text-gray-400">
                    per {isGame ? "hour" : "night"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-24">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Booking Summary
          </h2>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Taxes & Fees</span>
            <span>₹0</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-gray-900 mt-3 pt-3 border-t">
            <span>Total</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          <button
            onClick={handleProceedToPay}
            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl mt-6 font-semibold text-sm sm:text-base transition-all"
          >
            Proceed to Pay
          </button>

          <p className="text-xs text-gray-400 mt-3 text-center">
            *Payment gateway integration coming soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
