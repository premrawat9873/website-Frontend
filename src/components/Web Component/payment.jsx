import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Heading from "../heading";
import Button from "../button";
import DropdownButton from "../dropdown";

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "");

export default function Payment() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState(null);
  const [cachedUser, setCachedUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || cachedUser;

  // 🧠 Fetch Sender Info (with caching)
  useEffect(() => {
    const storedSender = localStorage.getItem("senderInfo");
    if (storedSender) {
      setSender(JSON.parse(storedSender));
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    axios
      .get("https://backend-website-6g6y.vercel.app/api/v1/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSender(res.data.user);
        localStorage.setItem("senderInfo", JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/signin");
      });
  }, [navigate]);

  // 💾 Cache receiver (for refresh)
  useEffect(() => {
    if (location.state?.user) {
      localStorage.setItem("paymentReceiver", JSON.stringify(location.state.user));
      setCachedUser(location.state.user);
    } else {
      const storedReceiver = localStorage.getItem("paymentReceiver");
      if (storedReceiver) setCachedUser(JSON.parse(storedReceiver));
    }
  }, [location.state?.user]);

  // 🪙 Handle Payment
  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      setMessage("⚠️ Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://backend-website-6g6y.vercel.app/api/v1/account/transfer",
        { amount: Number(amount), to: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ " + response.data.message);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error(error);
      if (error.response) {
        setMessage(`❌ ${error.response.data.message || "Payment failed"}`);
      } else {
        setMessage("⚠️ Network error or server not reachable.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✨ Derived UI values
  const senderFirst = capitalize(sender?.firstName);
  const receiverFirst = capitalize(user?.firstName);
  const receiverLast = capitalize(user?.lastName);
  const receiverInitials =
    (user?.firstName?.[0]?.toUpperCase() || "") +
    (user?.lastName?.[0]?.toUpperCase() || "");

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-lg">
        ⚠️ No user selected for payment.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {/* 🌄 Background */}
      <div className="absolute inset-0 bg-[url('/src/assets/download.jpg')] bg-cover bg-center bg-no-repeat"></div>

      {/* 🧊 Overlay */}
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm"></div>

      {/* 🌟 Main Content */}
      <div className="relative z-10 p-4 flex flex-col items-center">
        {/* 🔹 Navbar */}
        <div className="flex justify-between items-center mt-4 px-6 py-3 w-full max-w-5xl 
                        bg-zinc-800/70 backdrop-blur-lg rounded-xl border border-zinc-600/40 
                        shadow-lg transition-all duration-300 hover:shadow-xl">
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
              Hello, <span className="text-blue-400">{senderFirst || "..."}</span>
            </span>
            <DropdownButton user={sender} />
          </div>
        </div>

        {/* 💳 Payment Card */}
        <div className="flex flex-col items-center mt-16 w-[360px] sm:w-[400px] 
                        bg-zinc-800/80 backdrop-blur-md border border-zinc-700/40 
                        rounded-2xl shadow-xl p-8 space-y-5 hover:shadow-2xl 
                        transition-all duration-300">
          <Heading text="Payment" />

          {/* 👤 Receiver Avatar */}
          <div className="flex items-center justify-center w-20 h-20 rounded-full 
                          bg-gradient-to-r from-blue-400 to-cyan-400 text-black 
                          font-bold text-2xl shadow-lg">
            {receiverInitials || "?"}
          </div>

          <div className="text-white text-lg font-semibold mt-2">
            {receiverFirst} {receiverLast}
          </div>

          {/* 💰 Input Field */}
          <div className="w-full mt-4">
            <label className="text-gray-300 text-sm mb-1 block">Amount (in ₹)</label>
            <input
              type="number"
              className="w-full h-10 bg-zinc-700/80 text-white text-lg rounded-lg 
                         px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 
                         placeholder-gray-400 transition-all"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* 🪙 Pay Button */}
          <div className="pt-4 w-full flex justify-center">
            <Button
              text={loading ? "Processing..." : "Pay"}
              onClick={handlePayment}
              disabled={loading}
            />
          </div>

          {message && (
            <div className="text-center text-sm text-gray-200 mt-2">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
}
