// src/App.jsx
import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import Footer from './components/Footer';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import Hero from './components/Hero';
import MyBookings from './pages/MyBookings';
import HotelReg from './components/HotelReg';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import AddRoom from './pages/hotelOwner/AddRoom';
import ListRoom from './pages/hotelOwner/ListRoom';

const App = () => {
  const location = useLocation();
  const isOwnerpath = location.pathname.includes("owner");

  // Simple route → hero content map
  const path = location.pathname;

  // pick content based on current route
  let heroProps = {
    title: "Explore Your Perfect Retreat",
    subtitle:
      "Experience unmatched elegance and comfort at the world’s finest hotels and resorts.",
    backgroundImage: "/src/assets/heroImage1.jpg",
  };

  if (path === "/") {
    heroProps = {
      title: "Explore Your Perfect Retreat",
      subtitle:
        "Experience unmatched elegance and comfort at the world’s finest hotels and resorts.",
      backgroundImage: "/src/assets/heroImage1.jpg",
    };
  } else if (path.startsWith("/rooms/")) {
    heroProps = {
      title: "Room Details",
      subtitle: "Find your perfect stay with full amenities and availability.",
      backgroundImage: "/src/assets/heroImage2.jpg", // swap to whatever you like
    };
  } else if (path === "/rooms") {
    heroProps = {
      title: "All Hotels & Rooms",
      subtitle: "Browse our curated collection across destinations.",
      backgroundImage: "/src/assets/heroImage3.jpg",
    };
  } else {
    // Default for other pages (About, Experience, etc.)
    heroProps = {
      title: "Welcome to HeavensInn",
      subtitle: "Luxury hospitality across destinations worldwide.",
      backgroundImage: "/src/assets/heroImage4.jpg",
    };
  }

  return (
    <div>
      {!isOwnerpath && <Navbar/>}
      {false && <HotelReg/>}

      {/* Show Hero on every page except owner paths
      {!isOwnerpath && <Hero {...heroProps} />} */}

      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/rooms' element={<AllRooms/>}/>
          <Route path='/rooms/:id' element={<RoomDetails/>}/>
          <Route path='/my-bookings'element={<MyBookings/>}/>
          <Route path='/owner' element={<Layout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path="add-room" element={<AddRoom/>}/>
            <Route path="list-room" element={<ListRoom/>}/>
          </Route>
        </Routes>
      </div>

      {!isOwnerpath && <Footer />}
    </div>
  )
}

export default App
