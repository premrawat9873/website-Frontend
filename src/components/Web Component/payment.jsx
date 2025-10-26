import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Heading from "../heading";
import Button from "../button";
import DropdownButton from "../dropdown";

const capitalize = (s) => {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

export default function Payment() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    axios
      .get("http://localhost:3000/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSender(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/signin");
      });
  }, [navigate]);

  if (!user) {
    return <div className="text-white">No user selected for payment.</div>;
  }

  // 🧠 Payment Handler
  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token"); // stored after login

      const response = await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        {
          amount: Number(amount),
          to: user._id, // or user.userId depending on your backend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  const senderFirst = capitalize(sender?.firstName);
  const receiverFirst = capitalize(user?.firstName);
  const receiverLast = capitalize(user?.lastName);
  const receiverInitials =
    (user?.firstName?.charAt(0) || "").toUpperCase() +
    (user?.lastName?.charAt(0) || "").toUpperCase();

  return (
    <div className="relative min-h-screen w-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/src/assets/download.jpg')] bg-cover bg-center"></div>

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Navbar */}
        <div className="flex justify-between items-center mt-3 pl-5 pr-10 bg-zinc-700/60 backdrop-blur-md rounded-lg w-full h-14 mx-auto">
          <svg
            onClick={() => navigate("/dashboard")}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="size-6 cursor-pointer"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>

          <div className="flex items-center gap-5">
            <div className="text-white">Hello, {senderFirst}</div>
            <DropdownButton user={sender} />
          </div>
        </div>

        {/* Card Section */}
        <div className="flex justify-center items-center mt-16">
          <div className="flex flex-col justify-between items-center rounded-xl mt-10 bg-zinc-800/80 backdrop-blur-md p-6 w-[400px]">
            <div className="flex justify-center items-center w-full">
              <Heading text={"Payment"} />
            </div>

            <button className="text-black text-2xl w-20 h-20 rounded-full bg-white flex items-center justify-center">
              {receiverInitials || (receiverFirst.charAt(0) || "")}
            </button>

            <div className="flex flex-col w-full mt-4 gap-3">
              <div className="text-white text-lg">{receiverFirst} {receiverLast}</div>
              <div className="text-white text-lg">Amount (in INR)</div>
              <input
                type="number"
                className="bg-zinc-700 rounded-lg pl-2 mt-1 text-white h-8"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="flex justify-center items-center pt-4">
                <Button
                  text={loading ? "Processing..." : "Pay"}
                  onClick={handlePayment}
                  disabled={loading}
                />
              </div>
              {message && (
                <div className="text-center text-white mt-3">{message}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
