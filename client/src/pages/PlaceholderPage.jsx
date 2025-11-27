// src/pages/PlaceholderPage.jsx
import React from "react";

const PlaceholderPage = ({ title }) => (
    <div className="text-center py-32">
        <h1 className="text-3xl md:text-4xl font-serif text-gray-800">{title}</h1>
        <p className="text-gray-600 mt-4">
        Page under construction. Coming soon!
        </p>
    </div>
    );

export default PlaceholderPage;
