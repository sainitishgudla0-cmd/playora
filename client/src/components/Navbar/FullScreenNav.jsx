import React, { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { NavbarContext } from "../../context/NavContext";
import { Globe } from "lucide-react"; // 🌍 clean minimal icon

const items = [
  { title: "ROOMS", marquee: "EXPLORE OUR ROOMS", path: "/rooms" },
  { title: "GAMES&SPORTS", marquee: "BOOK YOUR FUN", path: "/games" },
  { title: "CONTACT", marquee: "GET IN TOUCH", path: "/contact" },
  { title: "PROFILE", marquee: "ACCESS YOUR ACCOUNT", path: "/register" },
];

export default function FullScreenNav() {
  const [navOpen, setNavOpen] = useContext(NavbarContext);
  const [time, setTime] = useState("");
  const fullRef = useRef(null);
  const moveRefs = useRef([]);
  const tweenRefs = useRef([]);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // 🕒 live clock
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(
          d.getMinutes()
        ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
      );
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // disable scroll when nav open
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "auto";
  }, [navOpen]);

  // open / close animation
  useGSAP(() => {
    if (!fullRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    if (navOpen) {
      tl.to(fullRef.current, { display: "block", duration: 0 })
        .to(".stair", { height: "100%", stagger: 0.1 })
        .to(".nav-item", { opacity: 1, rotateX: 0, stagger: 0.05 })
        .to(".clock-bar", { opacity: 1, y: 0 }, "-=0.3");
    } else {
      tl.to(".nav-item", { opacity: 0, rotateX: 90, stagger: 0.05 })
        .to(".stair", { height: 0, stagger: 0.1 })
        .to(".clock-bar", { opacity: 0, y: 20 })
        .to(fullRef.current, { display: "none", duration: 0 });
    }
  }, [navOpen]);

  // hover scroll (desktop only)
  const startScroll = (i) => {
    if (isMobile) return; // ❌ disable on mobile
    const el = moveRefs.current[i];
    if (!el) return;
    gsap.to(`#title-${i}`, { opacity: 0, duration: 0.1 });
    gsap.to(`#band-${i}`, { opacity: 1, duration: 0.1 });
    if (tweenRefs.current[i]) tweenRefs.current[i].kill();
    tweenRefs.current[i] = gsap.to(el, {
      x: "-=700",
      duration: 4,
      ease: "none",
      repeat: -1,
    });
  };

  const stopScroll = (i) => {
    if (isMobile) return; // ❌ disable on mobile
    gsap.to(`#title-${i}`, { opacity: 1, duration: 0.2 });
    gsap.to(`#band-${i}`, { opacity: 0, duration: 0.2 });
    if (tweenRefs.current[i]) tweenRefs.current[i].kill();
    const el = moveRefs.current[i];
    if (el) gsap.set(el, { x: 0 });
  };

  const handleLogoClick = () => {
    navigate("/");
    setNavOpen(false);
  };

  const handleItemClick = (path) => {
    const token = localStorage.getItem("token");
    if (path === "/register" || path === "/profile") {
      navigate(token ? "/customer/dashboard" : "/register");
    } else {
      navigate(path);
    }
    setNavOpen(false);
  };

  // ✅ on mobile, tap once to show static yellow highlight (no scroll)
  const handleMobileTap = (i, path) => {
    if (!isMobile) return handleItemClick(path);
    const band = document.getElementById(`band-${i}`);
    const title = document.getElementById(`title-${i}`);
    const isVisible = gsap.getProperty(band, "opacity") > 0.5;

    if (!isVisible) {
      gsap.to(title, { opacity: 0, duration: 0.15 });
      gsap.to(band, { opacity: 1, duration: 0.2 });
    } else {
      handleItemClick(path);
    }
  };

  return (
    <div
      ref={fullRef}
      className="fixed top-0 left-0 w-full h-screen z-50 hidden text-white overflow-hidden"
    >
      {/* background columns */}
      <div className="h-screen w-full fixed flex">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="stair h-0 w-1/5 bg-black"></div>
        ))}
      </div>

      {/* header */}
      <div className="relative z-20 flex justify-between lg:p-5 p-3">
        <div
          onClick={handleLogoClick}
          className="cursor-pointer select-none lg:w-auto"
        >
          <h1 className="text-white font-semibold tracking-wide font-bileha text-4xl sm:text-5xl hover:text-[#D3FD50] transition-colors duration-300">
            Playora
          </h1>
        </div>
        <div
          onClick={() => setNavOpen(false)}
          className="lg:h-20 h-16 w-16 relative cursor-pointer"
        >
          <div className="lg:h-44 h-24 w-0.5 -rotate-45 origin-top absolute bg-[#D3FD50]"></div>
          <div className="lg:h-44 h-24 w-0.5 right-0 rotate-45 origin-top absolute bg-[#D3FD50]"></div>
        </div>
      </div>

      {/* menu list */}
      <div className="relative z-20 flex flex-col justify-center font-[font2] h-[70vh] sm:h-[65vh]">
        {items.map((item, i) => (
          <div
            key={i}
            className={`nav-item border-t border-white/20 w-full flex justify-center items-center ${
              isMobile ? "h-[17vh]" : "h-[21vh]"
            } relative overflow-hidden ${
              i === items.length - 1 ? "border-b border-white/20" : ""
            }`}
            onMouseEnter={() => startScroll(i)}
            onMouseLeave={() => stopScroll(i)}
            onClick={() =>
              isMobile ? handleMobileTap(i, item.path) : handleItemClick(item.path)
            }
          >
            <h1
              id={`title-${i}`}
              className={`${
                isMobile ? "text-3xl" : "text-5xl lg:text-[5vw]"
              } font-bileha uppercase leading-[0.9] transition-all duration-150 cursor-pointer`}
            >
              {item.title}
            </h1>

            {/* marquee / static band */}
            <div
              id={`band-${i}`}
              className={`absolute inset-0 bg-[#D3FD50] flex items-center justify-center overflow-hidden opacity-0`}
            >
              {isMobile ? (
                <p className="text-black font-semibold text-lg uppercase tracking-wide text-center">
                  {item.marquee}
                </p>
              ) : (
                <div
                  ref={(el) => (moveRefs.current[i] = el)}
                  className="flex items-center gap-10 pl-10"
                >
                  <p className="whitespace-nowrap text-[6vw] uppercase text-black">
                    {item.marquee}
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                    className="lg:h-32 h-20 rounded-full object-cover lg:w-80 w-32"
                    alt=""
                  />
                  <p className="whitespace-nowrap text-[6vw] uppercase text-black">
                    {item.marquee}
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                    className="lg:h-32 h-20 rounded-full object-cover lg:w-80 w-32"
                    alt=""
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* bottom info bar */}
      <div className="clock-bar absolute bottom-0 left-0 w-full flex flex-col sm:flex-row sm:justify-between sm:items-center px-5 sm:px-10 py-3 border-t border-white/10 text-xs sm:text-sm font-semibold tracking-wider text-gray-300 opacity-0 translate-y-5 gap-2 sm:gap-0">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <Globe className="w-4 h-4 text-white" />
          <p>HYDERBAD_{time}</p>
        </div>

        <div className="hidden md:flex gap-6 uppercase">
          {["Privacy Policy", "Privacy Notice", "Ethics Report", "Consent Choices"].map(
            (txt) => (
              <p
                key={txt}
                className="cursor-pointer hover:text-[#D3FD50] transition-all"
              >
                {txt}
              </p>
            )
          )}
        </div>

        <div className="flex justify-center sm:justify-end gap-2">
          {["FB", "IG", "IN", "BE"].map((item) => (
            <div
              key={item}
              className="border border-white rounded-full px-3 py-1 text-xs hover:bg-[#D3FD50] hover:text-black transition-all cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
