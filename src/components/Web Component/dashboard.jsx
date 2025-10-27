import DropdownButton from "../dropdown";
import { useState, useEffect } from "react";
import Person from "../person";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [balance, setBalance] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const navigate = useNavigate();

  // 🧍‍♂️ Fetch user info with cache
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const cachedUser = localStorage.getItem("cachedUser");
    if (cachedUser) {
      const parsed = JSON.parse(cachedUser);
      if (Date.now() - parsed.timestamp < 1000 * 60 * 5) { // 5 min expiry
        setUser(parsed.data);
        setLoadingUser(false);
      }
    }

    axios
      .get("https://backend-website-6g6y.vercel.app/api/v1/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
        setLoadingUser(false);
        localStorage.setItem(
          "cachedUser",
          JSON.stringify({ data: res.data.user, timestamp: Date.now() })
        );
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/signin");
      });
  }, [navigate]);

  // 💰 Fetch balance with cache
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const cachedBalance = localStorage.getItem("cachedBalance");
    if (cachedBalance) {
      const parsed = JSON.parse(cachedBalance);
      if (Date.now() - parsed.timestamp < 1000 * 60 * 5) {
        setBalance(parsed.data);
        setLoadingBalance(false);
      }
    }

    axios
      .get("https://backend-website-6g6y.vercel.app/api/v1/account/balance", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBalance(res.data.balance);
        setLoadingBalance(false);
        localStorage.setItem(
          "cachedBalance",
          JSON.stringify({ data: res.data.balance, timestamp: Date.now() })
        );
      })
      .catch((err) => {
        console.error("Balance fetch failed:", err);
        setBalance(null);
        setLoadingBalance(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-full bg-[url('/src/assets/download.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
      <div className="flex flex-col w-full min-h-screen items-center">

        {/* 🔷 HEADER */}
        <div className="flex justify-between items-center mt-6 px-8 py-3 
                        bg-gradient-to-r from-zinc-800/70 to-zinc-700/60 
                        backdrop-blur-xl border border-zinc-600/30 
                        rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] 
                        w-full max-w-[1450px] h-20 mx-auto relative z-40 
                        transition-all duration-300 hover:shadow-[0_6px_25px_rgba(0,0,0,0.45)]">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full 
                            flex items-center justify-center text-white font-bold text-xl 
                            shadow-md">
              💸
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-wide">
              Payment <span className="text-blue-400">App</span>
            </h1>
          </div>

          {/* Right */}
          <div className="flex justify-end items-center gap-5 pr-5">
            <p className="text-gray-200 text-lg font-medium transition-opacity duration-500">
              {loadingUser ? (
                <span className="animate-pulse text-gray-500">Loading...</span>
              ) : (
                <>Hello, <span className="text-blue-400">{user?.firstName}</span></>
              )}
            </p>
            <div className="transform hover:scale-105 transition-all duration-300">
              <DropdownButton user={user} />
            </div>
          </div>
        </div>

        {/* 💰 BALANCE CARD */}
        <div className="w-350 h-32 bg-zinc-800/60 backdrop-blur-md mt-10 rounded-2xl 
                        border border-zinc-600/40 shadow-lg hover:shadow-xl 
                        transform hover:scale-[1.02] transition-all duration-300">
          <div className="text-white text-3xl font-semibold pl-6 pt-5">Your Balance</div>
          <div className="text-blue-400 text-4xl pl-6 pt-3 font-bold tracking-wide transition-opacity duration-500">
            {loadingBalance
              ? <span className="animate-pulse text-gray-500">Loading...</span>
              : `₹ ${balance?.toFixed(2)}`}
          </div>
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="flex justify-start items-center mt-10 w-350 h-14 
                        bg-zinc-800/60 backdrop-blur-md rounded-2xl px-5 
                        border border-zinc-700/40 shadow-md focus-within:ring-2 ring-blue-400/60 transition-all">
          <svg
            className="w-6 h-6 text-gray-400 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
          </svg>
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a person..."
            className="flex-1 bg-transparent text-white text-lg focus:outline-none 
                       placeholder-gray-400"
          />
        </div>

        {/* 👥 PERSON LIST */}
        <div className="mt-8 mb-8 w-full flex justify-center">
          <Person search={search} />
        </div>

      </div>
    </div>
  );
}
