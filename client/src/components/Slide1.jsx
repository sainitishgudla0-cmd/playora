import React from 'react'

const Slide1 = () => {
    return(        
    <section className="bg-white text-[#0b0b0b]">
        {/* --- BEACHFRONT GLAMOUR SECTION --- */}
        <div className="text-center py-20 px-6 md:px-16 lg:px-28">
            <h2 className="text-[18px] font-bileha tracking-[0.35em] uppercase mb-6">
            Beachfront Glamour in Marina
            </h2>
            <p className="max-w-2xl mx-auto text-[13px] leading-[1.8] font-light text-[#1e1e1e]">
            An enclave of impeccable style, One&amp;Only The Palm is a boutique beach
            resort on Chennai’s glamorous Palm Island. Discover a space for every mood,
            from{" "}
            <a
                href="#"
                className="underline hover:opacity-70 text-[#0b0b0b] transition"
            >
                Chef Tamilavanam
            </a>{" "}
            Michelin-starred cuisine to exceptional pool days and revitalising wellness
            at{" "}
            <a
                href="#"
                className="underline hover:opacity-70 text-[#0b0b0b] transition"
            >
                Guerlain Spa
            </a>
            .
            </p>
            <button className="mt-8 border border-[#0b0b0b] px-8 py-[10px] text-[13px] tracking-[0.25em] uppercase hover:bg-[#0b0b0b] hover:text-white transition">
            Book Your Stay
            </button>
        </div>

        {/* --- FESTIVE SEASON SECTION --- */}
    

        <div className=" bg-gray-100 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-16 px-6 md:px-12 lg:px-20 gap-12">
        <div className="w-full md:w-[30%] text-center">
        <div className="border-t border-b border-[#0b0b0b] pt-20 pb-20">
        <h3 className="text-[18px] font-bileha tracking-[0.35em] uppercase mb-6 text-[#0b0b0b] leading-[1.5]">
            A Festive Season<br />of Wonder
        </h3>

        <p className="text-[13px] text-[#1e1e1e] leading-[1.7] font-light mb-10">
            Step into a season defined by timeless celebrations and unforgettable
            moments. Whether gathering with family for shared joy, toasting with
            friends in spirited cheer, or embracing romance beneath starlit skies,
            the holidays at One&amp;Only The Palm are shaped by togetherness,
            elegance, and wonder.
        </p>

        <button className="border border-[#0b0b0b] px-8 py-[10px] text-[13px] tracking-[0.25em]  uppercase hover:bg-[#0b0b0b] hover:text-white transition">
            Explore
        </button>
        </div>
    </div>

            {/* Right Image */}
            <div className="md:w-[70%] md:h-[600px] lg:h-[480px] mr-10 overflow-hidden rounded-sm">
            <img
                src="/src/assets/heroImage1.jpg"
                alt="Festive Season Dubai"
                className="w-full object-cover rounded-sm"
            />
            </div>
        </div>
        </section>
    );
    };
export default Slide1
