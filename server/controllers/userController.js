import bcrypt from "bcryptjs";
import User from "../models/User.js";

// ✅ Get User Data using JWT Token
// GET /api/users/me
export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({
      success: true,
      role: user.role,
      name: user.name,
      email: user.email,
      recentSearchedCities: user.recentSearchedCities || [],
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("getUserData error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Store User’s Recently Searched Cities (max 3)
// POST /api/users/recent-searched-cities
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    const user = await User.findById(req.user.id);

    if (!recentSearchedCity)
      return res
        .status(400)
        .json({ success: false, message: "City name required" });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.recentSearchedCities = user.recentSearchedCities || [];

    // Keep only last 3 searches
    if (user.recentSearchedCities.length >= 3) {
      user.recentSearchedCities.shift();
    }

    user.recentSearchedCities.push(recentSearchedCity);
    await user.save();

    res.json({
      success: true,
      message: "City added successfully",
      data: user.recentSearchedCities,
    });
  } catch (error) {
    console.error("storeRecentSearchedCities error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update User Profile (Name, Email, Password)
// PUT /api/users/update-profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Update name
    if (name && name.trim()) user.name = name.trim();

    // Update email if not taken
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists)
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      user.email = email;
    }

    // Update password if valid
    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    } else if (password && password.trim().length > 0) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    await user.save();

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      recentSearchedCities: user.recentSearchedCities || [],
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      message: "Profile updated successfully ✅",
      user: safeUser,
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
