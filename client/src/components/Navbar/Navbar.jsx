import React, { useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavbarColorContext, NavbarContext } from "../../context/NavContext";
import gsap from "gsap";

const Navbar = () => {
  const [navOpen, setNavOpen] = useContext(NavbarContext);
  const [navColor] = useContext(NavbarColorContext);
  const navigate = useNavigate();
  const location = useLocation();
  const blockRefs = useRef([]);

  const path = location.pathname;
  const isContact = path === "/contact";
  const isHome = path === "/";
  const isLogin = path === "/login";
  const isRegister = path === "/register";
  const isMenuOnly = isContact || isHome || isLogin || isRegister;
  const isTransparent = isHome || isLogin || isRegister;

  const handleLogoClick = () => {
    navigate("/");
    setNavOpen(false);
  };

  const blocks = [
    { label: "ROOMS", height: "70px", route: "/rooms" },
    { label: "GAMES & SPORTS", height: "90px", route: "/games" },
    { label: "MENU", height: "110px", onClick: () => setNavOpen(true) },
  ];

  // ✅ entrance animation for desktop only
  useEffect(() => {
    if (isMenuOnly || window.innerWidth < 768) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.set(blockRefs.current, { y: -80, opacity: 0 });
    tl.to(blockRefs.current, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
    });
  }, [path, isMenuOnly]);

  // ✅ fixed scroll animation for desktop only
  useEffect(() => {
    if (window.innerWidth < 768) return; // skip mobile

    const maxOffset = 120;
    const onScroll = () => {
      const cur = window.scrollY;
      const target = Math.min(Math.max(cur * 0.6, 0), maxOffset);
      gsap.to(blockRefs.current.slice(0, 2), {
        y: -target,
        opacity: target > 10 ? 0.3 : 1,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]); // ✅ reattach on route change

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 font-[Poppins] ${
        isTransparent
          ? "bg-transparent"
          : isContact
          ? "bg-black text-white"
          : "bg-white text-black"
      }`}
    >
      {/* -------- MOBILE NAVBAR (FIXED) -------- */}
      <div className="flex sm:hidden items-center justify-between h-[70px] px-5 relative">
        {/* LEFT LOGO */}
        <div
          onClick={handleLogoClick}
          className="cursor-pointer select-none flex items-center"
        >
          <h1
            className={`font-bileha text-[1.8rem] font-semibold tracking-wide ${
              isContact ? "text-white" : "text-black"
            }`}
          >
            Playora
          </h1>
        </div>

        {/* MENU BUTTON (Pinned to right corner) */}
        <button
          onClick={() => setNavOpen(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-[42px] w-[90px] flex items-center justify-center bg-black text-white rounded-sm shadow-md active:scale-95 transition-all group"
        >
          <span className="absolute inset-0 bg-[#D3FD50] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-200 ease-out"></span>
          <span className="relative z-10 font-bileha text-[12px] tracking-wider font-semibold group-hover:text-black">
            MENU
          </span>
        </button>
      </div>

      {/* -------- DESKTOP NAVBAR -------- */}
      <div className="hidden sm:flex justify-between items-start w-full h-[90px]">
        {/* LEFT LOGO */}
        <div
          onClick={handleLogoClick}
          className="cursor-pointer select-none flex items-center pl-12 h-full"
        >
          <h1
            className={`font-semibold text-[2.5rem] font-bileha tracking-wide ${
              isContact ? "text-white" : "text-black"
            }`}
          >
            Playora
          </h1>
        </div>

        {/* RIGHT STEPPED BLOCKS */}
        <div className="flex justify-end w-[55%] overflow-hidden">
          {isMenuOnly ? (
            // Minimal menu for /home/contact pages
            <div
              onClick={() => setNavOpen(true)}
              className="relative overflow-hidden flex items-center justify-center cursor-pointer h-[90px] w-[120px] group bg-black text-white"
            >
              <span className="absolute top-0 left-0 w-full h-0 bg-[#D3FD50] group-hover:h-full transition-all duration-200 ease-out pointer-events-none"></span>
              <span className="relative z-10 uppercase text-[13px] font-bileha font-semibold tracking-wider group-hover:text-black transition-colors duration-200">
                MENU
              </span>
            </div>
          ) : (
            // Stepped layout for other pages
            blocks.map((block, i) => (
              <div
                key={i}
                ref={(el) => (blockRefs.current[i] = el)}
                onClick={
                  block.onClick ? block.onClick : () => navigate(block.route)
                }
                className="relative group overflow-hidden bg-black text-white flex items-center justify-center cursor-pointer"
                style={{
                  height: block.height,
                  width: i === 0 ? "33%" : i === 1 ? "37%" : "30%",
                  marginLeft: i === 0 ? 0 : "-1px",
                }}
              >
                <span className="absolute top-0 left-0 w-full h-0 bg-[#D3FD50] group-hover:h-full transition-all duration-200 ease-out pointer-events-none"></span>
                <span className="relative z-10 uppercase text-[13px] font-semibold tracking-wider group-hover:text-black transition-colors duration-200">
                  {block.label}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
