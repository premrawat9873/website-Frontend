import DropdownButton from "../dropdown";
import { useState,useEffect } from "react";
import Person from "../person";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [balance, setBalance] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    axios.get("http://localhost:3000/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/signin");
      });
  }, [navigate]);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get("http://localhost:3000/api/v1/account/balance", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBalance(res.data.balance))
      .catch((err) => {
        console.error("Balance fetch failed:", err);
        setBalance(null);
      });
  }, []);

  return (
    <div className="min-h-screen w-full bg-[url('/src/assets/download.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
      <div className="flex flex-col w-full min-h-screen items-center">
        {/* Header */}
        <div className="flex justify-between items-center mt-5 px-5 pb-5 bg-zinc-700/50 backdrop-blur-md rounded-lg w-full max-w-[1450px] h-16 mx-auto relative z-40">
          <div>
            <div className="text-3xl text-white mt-2">Payment App</div>
          </div>
          <div className="flex justify-end pr-10 items-center">
            <div className="pr-5 pt-3 text-white">Hello, {user ? user.firstName : "Loading..."}</div>
            <div className="pt-4">
              <DropdownButton user={user} />
            </div>
          </div>
        </div>
        
        {/* Balance Card */}
        <div className="w-350 h-30 bg-zinc-700/50 backdrop-blur-md mt-10 rounded-lg">
          <div className="text-white text-4xl pl-5 pt-5">Your Balance</div>
          <div className="text-white text-2xl pl-5 pt-2">{balance !== null ? `₹ ${balance.toFixed(2)}` : "Loading..."}</div>
        </div>
        
        {/* Search Bar */}
        <div className="flex justify-start items-center mt-10 w-350 h-12 bg-zinc-700/50 backdrop-blur-md rounded-lg">
          <svg
            className="w-6 h-6 ml-10 mt-1 text-gray-700 dark:text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter the person name"
            className="text-white text-2xl flex-1 border-zinc-800 focus:border-blue-500 focus:ring-0 outline-none p-2 rounded bg-transparent"
          />
        </div>
        
        {/* Person List */}
        <div className="mt-5 mb-5 w-full flex justify-center">
          <Person />
        </div>
      </div>
    </div>
  );
}