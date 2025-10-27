import { useEffect, useState } from "react";
import Button from "./button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const capitalize = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

export default function Person({ search }) {
  const navigate = useNavigate();
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🧠 Fetch all users (cached)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const cachedUsers = localStorage.getItem("cachedUsers");
    if (cachedUsers) {
      const parsed = JSON.parse(cachedUsers);
      if (Date.now() - parsed.timestamp < 1000 * 60 * 5) {
        setPersons(parsed.data);
        setLoading(false);
      }
    }

    axios
      .get("https://backend-website-6g6y.vercel.app/api/v1/users/bulk", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const users = res.data?.users || [];
        setPersons(users);
        setLoading(false);
        localStorage.setItem(
          "cachedUsers",
          JSON.stringify({ data: users, timestamp: Date.now() })
        );
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
        }
        setLoading(false);
      });
  }, [navigate]);

  // 🌀 Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredPersons = persons.filter((p) => {
    if (!search?.trim()) return true;
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filteredPersons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredPersons.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePaymentClick = (user) => {
    navigate("/payment", { state: { user } });
  };

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4 md:px-6 lg:px-10 transition-opacity duration-500 overflow-x-hidden">
      {loading ? (
        // 💀 Skeleton Loader
        Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center h-20 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 
                       pl-6 pr-4 mt-5 bg-zinc-700/40 backdrop-blur-md 
                       rounded-2xl shadow-md animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-600"></div>
              <div className="h-4 w-32 bg-gray-600 rounded"></div>
            </div>
            <div className="h-8 w-32 bg-gray-600 rounded-lg"></div>
          </div>
        ))
      ) : currentUsers.length > 0 ? (
        currentUsers.map((p, index) => (
          <div
            key={index}
            className="flex justify-between items-center h-20 w-full sm:w-[97%] md:w-[97%] lg:w-[97%] xl:w-[97%] 
                       pl-6 pr-5 mt-5 bg-zinc-700/50 backdrop-blur-md 
                       rounded-2xl shadow-lg transition-all duration-300 
                       hover:shadow-xl hover:scale-[1.01]"
          >
            <AllUsers p={p} onClick={() => handlePaymentClick(p)} />
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-lg mt-8">No users found</p>
      )}

      {/* 🔘 Pagination Controls */}
      {!loading && filteredPersons.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border border-gray-600 text-white text-sm sm:text-base
              ${
                currentPage === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-700 transition"
              }`}
          >
            ← Previous
          </button>
          <span className="text-gray-300 text-sm sm:text-base">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border border-gray-600 text-white text-sm sm:text-base
              ${
                currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-700 transition"
              }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function AllUsers({ p, onClick }) {
  const first = capitalize(p?.firstName);
  const last = capitalize(p?.lastName);
  const initials =
    (p?.firstName?.charAt(0) || "").toUpperCase() +
    (p?.lastName?.charAt(0) || "").toUpperCase();

  return (
    <>
      <div className="flex items-center gap-3">
        <button className="text-black text-xl sm:text-2xl w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white font-semibold">
          {initials || first.charAt(0)}
        </button>
        <h1 className="text-white text-base sm:text-lg md:text-xl">
          {first} {last}
        </h1>
      </div>
      <Button text={"Make Payment"} onClick={onClick} />
    </>
  );
}
