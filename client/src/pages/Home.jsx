import React from "react";
import HeroSection from "../components/HeroSection/HeroSection";

/*
🪄 Optional sections to enable after hero:
import Slide1 from "../components/Slide1";
import FeaturedDestination from "../components/FeaturedDestination";
import ExclusiveOffers from "../components/ExclusiveOffers";
import Testimonial from "../components/Testimonial";
import NewsLetter from "../components/NewsLetter";
*/

const Home = () => {
  return (
    <>
      {/* Step 1 → Hero Section */}
      <HeroSection
        onScrollClick={() => {
          const next = document.getElementById("page-content");
          if (next) next.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Step 2 → Placeholder for scrolling target */}
      <div id="page-content" className="min-h-screen bg-white text-black">
        {/* Replace this with actual sections later */}
      </div>

      {/* Optional future sections */}
      {/* 
      <Slide1 />
      <FeaturedDestination />
      <ExclusiveOffers />
      <Testimonial />
      <NewsLetter />
      */}
    </>
  );
};

export default Home;
