// src/assets/facilityAssets.js
// Dedicated mapping for amenities and facilities

export const facilityIcons = {
  "Wi-Fi": "/icons/wifi.png",
  AC: "/icons/air-conditioner.png",
  TV: "/icons/smart-tv.png",
  "Private Pool": "/icons/swimming-pool.png",
  Restaurant: "/icons/restaurant.png",
  Bar: "/icons/wine.png",
};

// Simple fallback icons
export const defaultFacilityIcons = {
  bed: "/icons/smart-tv.png",
  pool: "/icons/swimming-pool.png",
  wifi: "/icons/wifi.png",
  ac: "/icons/air-conditioner.png",
};

// Generic descriptive section (optional, for RoomDetails bottom info)
export const facilityDescriptions = [
  {
    icon: "/icons/wifi.png",
    title: "Seamless Connectivity",
    description:
      "Enjoy high-speed Wi-Fi across the entire property to stay connected.",
  },
  {
    icon: "/icons/air-conditioner.png",
    title: "Cool Comfort",
    description:
      "Relax in our climate-controlled rooms equipped with modern air conditioning.",
  },
  {
    icon: "/icons/smart-tv.png",
    title: "Entertainment Hub",
    description:
      "Each suite features a Smart TV with access to your favorite OTT platforms.",
  },
  {
    icon: "/icons/swimming-pool.png",
    title: "Private Pool",
    description:
      "Selected rooms include a private swimming pool and deck with a serene view.",
  },
];
