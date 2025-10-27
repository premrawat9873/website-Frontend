import InputField from "../input";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Button from "../button";
import Heading from "../heading";
import Subheading from "../subheading";
import Bottom from "../bottom";
import {
  emailState,
  passwordState,
  firstNameState,
  lastNameState,
} from "../atoms/signupAtoms";
import { tokenState } from "../atoms/tokenAtom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const email = useRecoilValue(emailState);
  const password = useRecoilValue(passwordState);
  const firstName = useRecoilValue(firstNameState);
  const lastName = useRecoilValue(lastNameState);
  const setToken = useSetRecoilState(tokenState);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(
        "https://backend-website-6g6y.vercel.app/api/v1/users/signup",
        { username: email, password, firstName, lastName },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.token || res.data.tokken || res.data.Tokken) {
        const token = res.data.token || res.data.tokken || res.data.Tokken;
        localStorage.setItem("token", token);
        setToken(token);
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      if (err.response?.data?.message) {
        alert(`Signup failed: ${err.response.data.message}`);
      } else {
        alert("Signup failed, please try again");
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center 
                 bg-[url('/src/assets/download.jpg')] bg-cover bg-center bg-no-repeat px-4"
    >
      {/* Compact Card */}
      <div
        className="flex flex-col items-center justify-center
                   w-full max-w-xs sm:max-w-sm bg-zinc-900/80 backdrop-blur-md
                   border border-zinc-700/40 rounded-2xl
                   shadow-[0_8px_30px_rgba(0,0,0,0.45)]
                   p-5 sm:p-6 space-y-4
                   transition-all duration-300"
      >
        {/* Heading */}
        <div className="text-center space-y-1">
          <Heading text={"Create Account"} />
          <Subheading text={"Sign up to get started"} />
        </div>

        {/* Inputs */}
        <div className="w-full space-y-2.5">
          <Inputs />
        </div>

        {/* Sign Up Button */}
        <div className="w-full flex justify-center mt-3">
          <Button
            text={"Sign Up"}
            onClick={handleSignup}
            className="bg-gradient-to-r from-blue-600 to-cyan-500
                       text-white font-semibold text-sm px-6 py-2 rounded-xl
                       shadow-md hover:shadow-lg hover:scale-[1.02]
                       active:scale-95 transition-all duration-300 ease-out"
          />
        </div>

        {/* Bottom Text */}
        <div className="-mt-2">
          <Bottom text={"Already have an account?"} link={"Sign In"} url={"/signin"} />
        </div>
      </div>
    </div>
  );
}

function Inputs() {
  const [firstName, setFirstName] = useRecoilState(firstNameState);
  const [lastName, setLastName] = useRecoilState(lastNameState);
  const [email, setEmail] = useRecoilState(emailState);
  const [password, setPassword] = useRecoilState(passwordState);

  const inputStyle =
    "w-full px-3 py-2 text-white bg-zinc-800/70 rounded-xl border border-zinc-600/40 \
     focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 outline-none \
     transition-all duration-300 text-sm";

  return (
    <>
      <InputField
        heading="First Name"
        placeholder="Enter your first name"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className={inputStyle}
      />
      <InputField
        heading="Last Name"
        placeholder="Enter your last name"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className={inputStyle}
      />
      <InputField
        heading="Email"
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputStyle}
      />
      <InputField
        heading="Password"
        placeholder="Create a password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={inputStyle}
      />
    </>
  );
}
