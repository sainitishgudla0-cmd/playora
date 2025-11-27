// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        await login(data.token, data.user);
        toast.success("Login successful ✅");

        setTimeout(() => {
          navigate("/customer/dashboard");
        }, 400);
      } else {
        // ✅ Show specific backend message
        if (res.status === 404) toast.error("User doesn't exist");
        else if (res.status === 401) toast.error("Invalid credentials");
        else toast.error(data.msg || data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error logging in");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-sky-100 to-white">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg w-full max-w-md p-8 border border-gray-200">
        <div className="flex justify-center mb-1">
          <button onClick={() => navigate("/")} aria-label="Playora Home">
            <h1 className="font-bileha text-4xl text-black tracking-wide">
              Playora
            </h1>
          </button>
        </div>

        <h2 className="text-center text-gray-700 font-bileha font-semibold text-2xl mb-4 mt-4">
          Sign in
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl transition-all font-bileha text-lg"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-sky-600 hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
