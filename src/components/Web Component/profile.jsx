import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DropdownButton from "../dropdown";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 🧠 Load user data (from navigation or cache)
  useEffect(() => {
    const stateUser = location.state?.user;
    if (stateUser) {
      setUser(stateUser);
      localStorage.setItem("profileUser", JSON.stringify(stateUser));
      return;
    }

    const cachedUser = localStorage.getItem("profileUser");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
      return;
    }

    // Fallback: fetch if cache missing
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://backend-website-6g6y.vercel.app/api/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem("profileUser", JSON.stringify(res.data.user));
        })
        .catch(() => {
          navigate("/signin");
        });
    } else {
      navigate("/signin");
    }
  }, [location.state, navigate]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {/* 🌄 Background */}
      <div className="absolute inset-0 bg-[url('/src/assets/download.jpg')] bg-cover bg-center bg-no-repeat"></div>

      {/* 🧊 Overlay */}
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"></div>

      {/* 🌟 Main Content */}
      <div className="relative z-10 flex flex-col items-center p-4 md:p-6">
        {/* 🔹 Navbar */}
        <div className="flex justify-between items-center mt-4 px-6 py-3 w-full max-w-5xl 
                        bg-zinc-800/70 backdrop-blur-lg rounded-xl border border-zinc-600/40 
                        shadow-lg transition-all duration-300 hover:shadow-xl">
          {/* ⬅️ Back Arrow */}
          <svg
            onClick={() => navigate("/dashboard")}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.6}
            stroke="white"
            className="w-7 h-7 cursor-pointer hover:scale-110 transition-transform"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12l7.5-7.5M3 12h18" />
          </svg>

          <div className="flex items-center gap-4 text-white">
            <span className="hidden md:block text-lg">
              Hello, <span className="text-blue-400">{user.firstName}</span>
            </span>
            <DropdownButton user={user} />
          </div>
        </div>

        {/* 🧍 Profile Card */}
        <div className="mt-16 bg-zinc-800/80 backdrop-blur-md border border-zinc-700/40 
                        rounded-2xl shadow-xl p-6 sm:p-8 w-[90%] max-w-[420px] 
                        flex flex-col items-center space-y-5 hover:shadow-2xl 
                        transition-all duration-300">
          {/* Avatar */}
          <div className="flex items-center justify-center w-20 h-20 rounded-full 
                          bg-gradient-to-r from-blue-400 to-cyan-400 text-black 
                          font-bold text-2xl shadow-lg">
            {(user.firstName?.[0] || "").toUpperCase()}
            {(user.lastName?.[0] || "").toUpperCase()}
          </div>

          {/* User Info */}
          <div className="text-center text-white space-y-2">
            <h2 className="text-2xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-300 text-sm">{user.email}</p>
          </div>

          {/* Details Section */}
          <div className="w-full mt-4 text-gray-200 text-sm space-y-2">
            <div className="flex justify-between border-b border-zinc-700 pb-2">
              <span className="text-gray-400">Username:</span>
              <span>{user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Created:</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Dashboard Button (optional extra) */}
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium 
                       py-2 px-6 rounded-xl transition-all duration-200 shadow-md"
          >
            Transactions
          </button>
        </div>
      </div>
    </div>
  );
}
