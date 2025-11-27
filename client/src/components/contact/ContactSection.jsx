// src/components/contact/ContactSection.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const bannerWrapRefs = useRef([]);
  const bannerInnerRefs = useRef([]);

  const titles = [
    "To talk about collaboration",
    "To give review of stay",
    "To talk about the events",
    "To talk about the hotel",
    "To talk about the restaurants",
    "To talk about diversity",
  ];

  useEffect(() => {
    const animateBanners = () => {
      bannerWrapRefs.current.forEach((wrap) => {
        if (!wrap) return;
        gsap.set(wrap, { rotate: -5, transformOrigin: "center center" });
      });

      bannerInnerRefs.current.forEach((inner) => {
        if (!inner || inner.dataset.duplicated) return;

        // ✅ Duplicate once
        inner.innerHTML = inner.innerHTML + inner.innerHTML;
        inner.dataset.duplicated = "true";

        // ✅ Wait for DOM paint before measuring
        requestAnimationFrame(() => {
          const loopWidth = inner.scrollWidth / 2;

          gsap.to(inner, {
            x: -loopWidth,
            duration: 35,
            ease: "linear",
            repeat: -1,
            modifiers: {
              x: gsap.utils.unitize((x) => parseFloat(x) % loopWidth),
            },
          });
        });
      });
    };

    // ✅ Delay to ensure layout is stable (especially mobile)
    const timeout = setTimeout(animateBanners, 400);

    // ✅ Scroll rotation effect
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      const goingDown = currentY > lastY;
      const targetAngle = goingDown ? -5 : 5;

      gsap.to(bannerWrapRefs.current, {
        rotate: targetAngle,
        duration: 0.45,
        ease: "power2.out",
        overwrite: true,
      });

      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="relative bg-black text-white font-[Poppins] overflow-x-hidden">
      <style>{`
        ::-webkit-scrollbar { display: none; }
        html, body {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div id="infinite-scroll">
        {titles.map((title, i) => (
          <div key={i} className="border-b border-gray-800">
            {/* TITLE SECTION */}
            <section className="relative min-h-screen flex flex-col justify-between items-center text-center px-4 sm:px-6 md:px-10 py-12 md:py-16">
              
              {/* --- TOP META AREA --- */}
              <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-0 px-2 sm:px-6 md:px-10 flex-[0.3]">
                <div className="text-xs sm:text-sm leading-relaxed opacity-80 text-left sm:text-left">
                  Onscreen or in an office.<br />
                  Here. There.<br />
                  Anywhere.
                </div>
                <div className="text-xs sm:text-sm leading-relaxed opacity-80 text-right">
                  525 Av. Viger O – Suite 400<br />
                  Montréal, QC H2Z 1G6 →
                </div>
              </div>

              {/* --- CENTERED MAIN TITLE --- */}
              <div className="flex flex-[0.4] justify-center items-center mt-10 sm:mt-0">
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-[7vw] font-extrabold uppercase leading-tight tracking-tight px-4">
                  {title}
                </h1>
              </div>

              {/* --- YELLOW STRIP SECTION --- */}
              <div className="flex-[0.3] flex justify-center items-end w-full mt-10 sm:mt-0">
                <div
                  ref={(el) => (bannerWrapRefs.current[i] = el)}
                  className="w-[200%] overflow-hidden flex justify-center bg-[#D6FF00] py-2 sm:py-3 md:py-4"
                  style={{ willChange: "transform" }}
                >
                  <div
                    ref={(el) => (bannerInnerRefs.current[i] = el)}
                    className="flex whitespace-nowrap text-black font-extrabold text-2xl sm:text-4xl md:text-6xl lg:text-[9vw] leading-none"
                  >
                    <span className="px-6 sm:px-12">
                      HELLO ✉️ NITISHG1782@GMAIL.COM • HELLO ✉️ NITISHG1782@GMAIL.COM •
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* FOLLOW-UP SECTION */}
            <section className="min-h-screen flex flex-col justify-center items-center text-center bg-black px-4">
              <p className="text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-10 tracking-widest font-semibold">
                FOLLOW&nbsp;US
              </p>
              <div className="flex gap-4 sm:gap-6 md:gap-10 flex-wrap justify-center">
                <a
                  href="https://www.instagram.com/5197nitish/"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 rounded-full text-lg sm:text-2xl md:text-3xl hover:bg-white hover:text-black transition-all duration-300"
                >
                  IG
                </a>
                <a
                  href="https://www.linkedin.com/in/sai-nitish-481a12226/"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 rounded-full text-lg sm:text-2xl md:text-3xl hover:bg-white hover:text-black transition-all duration-300"
                >
                  IN
                </a>
              </div>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactSection;
