import { useEffect, useState } from "react";
import Button from "./button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const capitalize = (s) => {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

export default function Person() {
    const navigate = useNavigate();
    const [persons, setPersons] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/signin");
            return;
        }

        axios.get("http://localhost:3000/api/v1/users/bulk", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            setPersons(res.data.user || []);
        })
        .catch((err) => {
            console.error("Error fetching users:", err);
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("token");
                navigate("/signin");
            }
        });
    }, []);

    const handlePaymentClick = (user) => {
        navigate("/payment", { state: { user } });
    };

    return (
        <div className="flex flex-col items-center">
            {persons.map((p, index) => (
                <div
                    key={index}
                    className="flex justify-between items-center h-20 w-350 pl-10 pr-5 mt-5 bg-zinc-700/50 backdrop-blur-md rounded-2xl"
                >
                    <AllUsers p={p} onClick={() => handlePaymentClick(p)} />
                </div>
            ))}
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
                <button className="text-black text-2xl w-10 h-10 rounded-full bg-white">
                    {initials || (first.charAt(0) || "")}
                </button>
                <h1 className="text-white text-lg">
                    {first} {last}
                </h1>
            </div>
            <Button text={"Make Payment"} onClick={onClick} />
        </>
    );
}
