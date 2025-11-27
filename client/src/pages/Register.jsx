// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully 🎉");

        // 🔹 Auto-login
        const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });
        const loginData = await loginRes.json();

        if (loginRes.ok && loginData.token) {
          await login(loginData.token, loginData.user);
          navigate("/customer/dashboard"); // ✅ redirect
        } else {
          navigate("/login");
        }
      } else {
        toast.error(data.message || data.msg || "Registration failed ❌");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Error creating account");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-sky-100 to-white">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg w-full max-w-md p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Create an account
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Sign up to book your dream stay at HeavensInn
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-xl transition-all"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-sky-700 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
