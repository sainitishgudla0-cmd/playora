import React, { useMemo, useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

// Make sure these CSS imports exist once globally (e.g., in index.css or App.jsx):
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';

const Hero = () => {
    // ===== Dates (no past dates) =====
    const today = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    const [openCalendar, setOpenCalendar] = useState(false);
    const [range, setRange] = useState([
        { startDate: today, endDate: today, key: "selection" },
    ]);

    const formattedRange = useMemo(() => {
        const { startDate, endDate } = range[0];
        if (!startDate || !endDate) return "SELECT DATES";
        const s = format(startDate, "dd MMM yyyy");
        const e = format(endDate, "dd MMM yyyy");
        return `${s} — ${e}`;
    }, [range]);

    const handleSelect = (r) => setRange([r.selection]);

    // ===== Guests & Promo =====
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [promo, setPromo] = useState("");

    const dec = (v, min, set) => () => set(Math.max(min, v - 1));
    const inc = (v, max, set) => () => set(Math.min(max, v + 1));

    const onSubmit = (e) => {
        e.preventDefault();
        const { startDate, endDate } = range[0];
        console.log({
            checkIn: format(startDate, "yyyy-MM-dd"),
            checkOut: format(endDate, "yyyy-MM-dd"),
            adults,
            children,
            promo,
        });
    };

    return (
        <section className="relative min-h-[100vh] bg-cover bg-center bg-white text-white">
            {/* Background layers */}
            <div className="absolute inset-0 h-160 bg-cover bg-center bg-[url('/src/assets/heroImage1.jpg')]" />
            <div className="absolute inset-0 h-160 bg-cover bg-center bg-black/30" />

            {/* Hero Content */}
            <div className="relative z-10 max-w-6xl mx-auto pt-28 md:pt-36 px-6">
                <div className="max-w-2xl">
                    <h2 className="uppercase tracking-[0.4em] text-sm mb-2 opacity-90">
                        YOUR LUXURY RESORT
                    </h2>
                    <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                        STAY IN CHENNAI
                    </h1>
                    <p className="mt-4 text-base md:text-lg opacity-90">
                        Explore our collection of low-rise Andalusian-style houses, stylish
                        suites and beachfront private villas.
                    </p>
                    <button className="mt-6 border border-white/80 px-6 py-3 tracking-widest text-sm uppercase hover:bg-white hover:text-black transition">
                        Explore
                    </button>
                </div>
            </div>

            {/* Booking Bar */}
            <div className="absolute inset-x-0 bottom-0 z-5 px-11">
                <div className="bg-white  text-gray-900 shadow-[0_-6px_24px_rgba(0,0,0,0.25)]">
                    <div className="mx-auto max-w-[1000px] px-2 md:px-5 py-6 md:py-5">
                        <form
                            onSubmit={onSubmit}
                            className="
                                grid items-end gap-8
                                grid-cols-1
                                md:grid-cols-[1.6fr_0.7fr_0.7fr_1.1fr_auto]
                            "
                        >
                            {/* Check-in / Check-out */}
                            <div className="relative">
                                <label className="uppercase tracking-[0.35em] text-[12px] font-semibold block mb-2">
                                    Check-in/Check-out
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setOpenCalendar((v) => !v)}
                                        aria-expanded={openCalendar}
                                        className="
                                            w-50 text-left text-[12px]
                                            pb-2 pr-8
                                            border-b border-gray-800
                                            hover:opacity-70 transition
                                        "
                                    >
                                        <span className={formattedRange === "SELECT DATES" ? "text-gray-900" : ""}>
                                            {formattedRange}
                                        </span>
                                    </button>
                                    {/* Caret */}
                                    <span className="pointer-events-none right-0 bottom-2 text-gray-700">
                                        ▾
                                    </span>
                                </div>

                                {/* Calendar Popover */}
                                <AnimatePresence>
                                    {openCalendar && (
                                        <motion.div
                                            key="calendar-pop"
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 12 }}
                                            transition={{ duration: 0.22, ease: "easeInOut" }}
                                            className="
                                                absolute left-0 bottom-[calc(100%+12px)]
                                                bg-white border border-gray-200 shadow-xl
                                                p-3 z-30
                                            "
                                        >
                                            <div className="overflow-x-auto">
                                                <DateRange
                                                    editableDateInputs
                                                    onChange={handleSelect}
                                                    moveRangeOnFirstSelection={false}
                                                    ranges={range}
                                                    months={2}
                                                    direction="horizontal"
                                                    minDate={today}
                                                    rangeColors={["#000000"]}
                                                    weekdayDisplayFormat="EEEEE"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Adults */}
                            <div className="flex flex-col">
                                <label className="uppercase tracking-[0.25em] text-[10px] font-semibold mb-2">
                                    Adults
                                </label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={dec(adults, 1, setAdults)}
                                        className="w-[36px] h-[36px] border border-gray-400 text-xl hover:bg-gray-200"
                                        aria-label="Decrease adults"
                                    >
                                        –
                                    </button>
                                    <div className="w-[36px] h-[36px] border border-gray-400 flex items-center justify-center text-lg select-none">
                                        {adults}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={inc(adults, 10, setAdults)}
                                        className="w-[36px] h-[36px] border border-gray-400 text-xl hover:bg-gray-50"
                                        aria-label="Increase adults"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Children */}
                            <div className="flex flex-col">
                                <label className="uppercase tracking-[0.25em] text-[10px] font-semibold mb-2">
                                    Children
                                </label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={dec(children, 0, setChildren)}
                                        className="w-[36px] h-[36px] border border-gray-400 text-xl hover:bg-gray-50"
                                        aria-label="Decrease children"
                                    >
                                        –
                                    </button>
                                    <div className="w-[36px] h-[36px] border border-gray-400 flex items-center justify-center text-lg select-none">
                                        {children}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={inc(children, 10, setChildren)}
                                        className="w-[36px] h-[36px] border border-gray-400 text-xl hover:bg-gray-50"
                                        aria-label="Increase children"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Check Availability */}
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="
                                        bg-[#7f7f7f] hover:bg-[#6f6f6f]
                                        text-white uppercase tracking-[0.2em] margin-5 text-sm
                                        px-15 h-[50px]
                                        rounded-none transition
                                    "
                                >
                                    Check Availability
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
