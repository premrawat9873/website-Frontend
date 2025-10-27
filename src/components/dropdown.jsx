import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { tokenState } from "./atoms/tokenAtom";

export default function DropdownButton({ user }) {
  const navigate = useNavigate();
  const setToken = useSetRecoilState(tokenState);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsOpen(false);
    navigate("/signin");
  };

  // Profile initials
  const initials =
    user && user.firstName
      ? user.firstName[0].toUpperCase() +
        (user.lastName ? user.lastName[0].toUpperCase() : "")
      : "U";

  return (
    <div
      className="relative inline-block text-left z-[9999]" // ✅ Highest layer
      ref={menuRef}
    >
      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full 
                   bg-zinc-700/70 text-white font-semibold shadow-md pl-2 
                   backdrop-blur-md border border-zinc-600 hover:bg-zinc-600 
                   transition-all duration-200"
      >
        {initials}
        <svg
          className="ml-1 h-3 w-3 text-white transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.094l3.71-3.862a.75.75 0 111.08 1.04l-4.25 4.425a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-44 rounded-md 
                     shadow-lg bg-zinc-800/95 text-white ring-1 ring-zinc-700 
                     backdrop-blur-md z-[10000] animate-fadeIn"
        >
          <div className="py-1">
            {/* Profile */}
            <button
              className="block px-4 py-2 text-sm text-gray-200 hover:bg-zinc-700/70 w-full text-left"
              onClick={() => {
                setIsOpen(false);
                navigate("/profile", { state: { user } }); // ✅ Pass user info
              }}
            >
              Profile
            </button>

            {/* Update */}
            <button
              className="block px-4 py-2 text-sm text-gray-200 hover:bg-zinc-700/70 w-full text-left"
              onClick={() => {
                setIsOpen(false);
                navigate("/update");
              }}
            >
              Update
            </button>

            {/* Logout */}
            <button
              className="block px-4 py-2 text-sm text-red-400 hover:bg-zinc-700/70 w-full text-left"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
