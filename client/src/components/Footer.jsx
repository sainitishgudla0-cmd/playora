// src/components/Footer.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState("");

  // Hyderabad (IST) time clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const istTime = new Intl.DateTimeFormat("en-IN", options).format(now);
      setTime(istTime);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const handleContact = () => navigate("/contact");
  const handleBackToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="w-full bg-black text-white pt-6 pb-4 px-4 sm:px-6 md:px-10 lg:px-20 font-[Poppins]">
      {/* --- TOP ROW --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
        {/* Social pills */}
        <div className="flex gap-3 sm:gap-4 flex-wrap justify-center sm:justify-start">
          {[
            { name: "FB", link: "https://www.facebook.com/" },
            { name: "IG", link: "https://www.instagram.com/5197nitish/" },
            { name: "IN", link: "https://www.linkedin.com/in/sai-nitish-481a12226/" },
            { name: "BE", link: "https://www.behance.net/" },
          ].map(({ name, link }) => (
            <a
              key={name}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white rounded-full px-5 sm:px-7 py-2 text-lg sm:text-2xl font-bold hover:bg-white hover:text-black transition-all"
            >
              {name}
            </a>
          ))}
        </div>

        {/* Contact pill */}
        <button
          onClick={handleContact}
          className="border border-white rounded-full px-8 sm:px-10 py-2 text-lg sm:text-2xl font-bold flex items-center gap-2 hover:bg-white hover:text-black transition-all"
        >
          CONTACT <span className="text-base sm:text-xl">♥</span>
        </button>
      </div>

      {/* Spacer for breathing room */}
      <div className="h-16 sm:h-24 md:h-36" />

      {/* --- BOTTOM BAR --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left text-xs sm:text-sm">
        {/* Hyderabad time */}
        <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-white rounded-full flex items-center justify-center text-base sm:text-lg">
            🌐
          </div>
          <span className="tracking-wide font-semibold text-xs sm:text-sm">
            HYDERABAD_{time}
          </span>
        </div>

        {/* Policy links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-6 font-medium uppercase tracking-wide">
          <a href="#" className="hover:opacity-70 text-[10px] sm:text-xs">Privacy Policy</a>
          <a href="#" className="hover:opacity-70 text-[10px] sm:text-xs">Privacy Notice</a>
          <a href="#" className="hover:opacity-70 text-[10px] sm:text-xs">Ethics Report</a>
          <a href="#" className="hover:opacity-70 text-[10px] sm:text-xs">Consent Choices</a>
        </div>

        {/* Back to top */}
        <button
          onClick={handleBackToTop}
          className="uppercase text-[10px] sm:text-xs md:text-sm font-bold hover:opacity-70"
        >
          BACK TO TOP
        </button>
      </div>
    </footer>
  );
};

export default Footer;
