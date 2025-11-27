// src/App.jsx
import React, { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ✅ Auth
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// navbar context + components
import NavContext from "./context/NavContext";
import Navbar from "./components/Navbar/Navbar";
import FullScreenNav from "./components/Navbar/FullScreenNav";
import Footer from "./components/Footer";

// pages
import Home from "./pages/Home";
import AnimatedHome from "./pages/AnimatedHome";
import ExploreRooms from "./pages/ExploreRooms";
import RoomDetails from "./pages/RoomDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import PlaceholderPage from "./pages/PlaceholderPage";
import Cart from "./pages/Cart";
import UserDashboard from "./pages/hotelCustomer/Dashboard"; // ✅ customer dashboard
import CustomerProfile from "./pages/hotelCustomer/Profile"; // ✅ customer profile

// ✅ new: hotel customer navbar
import CustomerNavbar from "./pages/hotelCustomer/Navbar";

// owner
import Layout from "./pages/hotelOwner/Layout";
import AddRoom from "./pages/hotelOwner/AddRoom";
import ListRoom from "./pages/hotelOwner/ListRoom";

// intro + effects
import ThreeIntro from "./components/ThreeIntro/ThreeIntroCanvas";
import BinaryCursor from "binary-cursor";

// contact + games
import ContactSection from "./components/contact/ContactSection";
import ExploreGames from "./pages/ExploreGames";
import GameDetails from "./pages/GameDetails";

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const location = useLocation();
  const path = location.pathname;
  const isOwnerPath = path.startsWith("/owner");

  // ✅ Smooth scroll (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smooth: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // ✅ Hide footer on specific routes
  const noFooterRoutes = ["/", "/login", "/register", "/contact"];

  return (
    <AuthProvider>
      <NavContext>
        {location.pathname === "/" && <BinaryCursor color="#D0FE1D" />}
        {showIntro ? (
          <ThreeIntro onComplete={() => setShowIntro(false)} />
        ) : (
          <div
            className={`transition-colors duration-700 ${
              path === "/"
                ? "bg-white h-screen overflow-hidden"
                : "bg-black min-h-screen"
            }`}
          >
            {/* ✅ Navbar Logic */}
            {!isOwnerPath && (
              <>
                {path.startsWith("/customer") ? (
                  <CustomerNavbar />
                ) : (
                  <>
                    <Navbar />
                    <FullScreenNav />
                  </>
                )}
              </>
            )}

            {/* ✅ Page Content */}
            <div
              className={`${
                path === "/"
                  ? "h-screen overflow-hidden pt-0"
                  : "min-h-screen pt-[80px]"
              } bg-white`}
            >
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/animated" element={<AnimatedHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/rooms" element={<ExploreRooms />} />
                <Route path="/rooms/:id" element={<RoomDetails />} />
                <Route path="/games" element={<ExploreGames />} />
                <Route path="/games/:id" element={<GameDetails />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route
                  path="/offers"
                  element={<PlaceholderPage title="Exclusive Offers" />}
                />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contact" element={<ContactSection />} />

                {/* 🔁 Backward compatibility */}
                <Route
                  path="/dashboard"
                  element={<Navigate to="/customer/dashboard" replace />}
                />

                {/* ✅ Protected customer routes */}
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/profile"
                  element={
                    <ProtectedRoute>
                      <CustomerProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/contact"
                  element={
                    <ProtectedRoute>
                      <ContactSection />
                    </ProtectedRoute>
                  }
                />

                {/* ✅ Owner routes */}
                <Route path="/owner" element={<Layout />}>
                  <Route path="add-room" element={<AddRoom />} />
                  <Route path="list-room" element={<ListRoom />} />
                </Route>
              </Routes>
            </div>

            {/* ✅ Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#fff7f0",
                  color: "#1a1a1a",
                  borderRadius: "8px",
                  border: "1px solid #f97316",
                  fontFamily: "Poppins, sans-serif",
                },
                success: {
                  iconTheme: { primary: "#f97316", secondary: "#fff" },
                },
              }}
            />

            {/* ✅ Footer (not on owner or no-footer pages) */}
            {!isOwnerPath && !noFooterRoutes.includes(path) && <Footer />}
          </div>
        )}
      </NavContext>
    </AuthProvider>
  );
};

export default App;
