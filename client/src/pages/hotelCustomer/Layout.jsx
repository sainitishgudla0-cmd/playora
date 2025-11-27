import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="pt-[80px] px-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
