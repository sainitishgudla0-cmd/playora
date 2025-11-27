import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { addDays, format, isWithinInterval, eachDayOfInterval } from "date-fns";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import API_BASE_URL from "../api";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const BookingCalendar = ({ roomId, onConfirm }) => {
  const [range, setRange] = useState([
    { startDate: new Date(), endDate: addDays(new Date(), 1), key: "selection" },
  ]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [prices, setPrices] = useState({});
  const [bookedRanges, setBookedRanges] = useState([]); // ⬅️ store unavailable date intervals
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch Prices (already in your code) ---------------- */
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/availability/${roomId}`);
        const data = await res.json();
        setPrices(data.prices || {});
      } catch (err) {
        console.error(err);
        toast.error("Failed to load pricing data");
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, [roomId]);

  /* ---------------- Fetch Booked Dates ---------------- */
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/id/${roomId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load room");

        if (data.bookedDates && data.bookedDates.length > 0) {
          const ranges = data.bookedDates.map((b) => ({
            start: new Date(b.checkIn),
            end: new Date(b.checkOut),
          }));
          setBookedRanges(ranges);
        } else {
          setBookedRanges([]);
        }
      } catch (err) {
        console.error("Error fetching booked dates:", err);
      }
    };
    fetchBookedDates();
  }, [roomId]);

  /* ---------------- Handle Date Change ---------------- */
  const handleRangeChange = (item) => {
    const { startDate, endDate } = item.selection;

    // Prevent selecting a blocked date
    const isConflict = bookedRanges.some((b) =>
      isWithinInterval(startDate, b) || isWithinInterval(endDate, b)
    );

    if (isConflict) {
      toast.error("Selected dates include unavailable days.");
      return;
    }

    setRange([item.selection]);
  };

  /* ---------------- Handle Confirm ---------------- */
  const handleCheck = () => {
    const { startDate, endDate } = range[0];
    if (!startDate || !endDate) {
      toast.error("Please select valid dates");
      return;
    }

    // Check conflict again before confirming
    const conflict = bookedRanges.some((b) =>
      eachDayOfInterval({ start: startDate, end: endDate }).some((day) =>
        isWithinInterval(day, b)
      )
    );
    if (conflict) {
      toast.error("Your selection overlaps with unavailable dates.");
      return;
    }

    onConfirm({
      checkInDate: format(startDate, "yyyy-MM-dd"),
      checkOutDate: format(endDate, "yyyy-MM-dd"),
      adults,
      children,
      promoCode,
    });

    toast.success("Dates selected successfully!");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500);
  };

  /* ---------------- Render Day Cell ---------------- */
  const renderDayContent = (day) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const price = prices[dateKey];

    // Gray out if the day is booked
    const isBooked = bookedRanges.some((b) =>
      isWithinInterval(day, b)
    );

    return (
      <div
        className={`flex flex-col items-center justify-center leading-tight ${
          isBooked ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        <span className="text-[15px] font-bold text-gray-800">{day.getDate()}</span>
        {price && (
          <span className="text-[12px] text-gray-600 font-bileha font-semibold mt-0.5">
            ₹{price.toLocaleString("en-IN")}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-6xl text-gray-800 text-center font-bileha font-semibold">
        {/* ===== Top Controls ===== */}
        <div className="flex flex-wrap items-center justify-center md:justify-between mb-6 gap-6 text-[15px]">
          {/* Adults */}
          <div className="flex items-center gap-3">
            <p className="uppercase tracking-wide">ADULTS</p>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="px-3 py-1 text-gray-600 font-semibold"
              >
                –
              </button>
              <span className="px-3 py-1">{adults}</span>
              <button
                onClick={() => setAdults(adults + 1)}
                className="px-3 py-1 text-gray-600 font-semibold"
              >
                +
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center gap-3">
            <p className="uppercase tracking-wide">CHILDREN</p>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="px-3 py-1 text-gray-600 font-semibold"
              >
                –
              </button>
              <span className="px-3 py-1">{children}</span>
              <button
                onClick={() => setChildren(children + 1)}
                className="px-3 py-1 text-gray-600 font-semibold"
              >
                +
              </button>
            </div>
          </div>

          {/* Promo Code */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5">
            <input
              type="text"
              placeholder="ENTER CODE"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="outline-none text-gray-700 w-32 text-center font-bileha font-semibold"
            />
          </div>

          {/* Check Availability */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCheck}
            className="bg-black hover:bg-gray-900 text-white font-semibold tracking-wide px-8 py-3 rounded-md uppercase transition-all text-[15px]"
          >
            CHECK AVAILABILITY
          </motion.button>
        </div>

        {/* ===== Calendar Section ===== */}
        <div className="border-t border-gray-200 pt-6 flex justify-center">
          <div className="inline-block">
            <DateRange
              editableDateInputs={true}
              onChange={handleRangeChange}
              moveRangeOnFirstSelection={false}
              ranges={range}
              months={2}
              direction="horizontal"
              minDate={new Date()}
              rangeColors={["#e3c9a8"]}
              showMonthAndYearPickers={true}
              showDateDisplay={false}
              dayContentRenderer={renderDayContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
