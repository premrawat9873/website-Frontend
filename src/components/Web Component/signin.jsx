import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Heading from "../heading";
import { tokenState } from "../atoms/tokenAtom";
import Subheading from "../subheading";
import InputField from "../input";
import Button from "../button";
import Bottom from "../bottom";
import { emailState, passwordState } from "../atoms/signupAtoms";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signin({ url }) {
  const email = useRecoilValue(emailState);
  const password = useRecoilValue(passwordState);
  const setToken = useSetRecoilState(tokenState);
  const navigate = useNavigate();

  const handleSignin = async () => {
    try {
      const res = await axios.post(
        "https://backend-website-6g6y.vercel.app/api/v1/users/signin",
        { username: email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.token || res.data.tokken || res.data.Tokken) {
        const token = res.data.token || res.data.tokken || res.data.Tokken;
        localStorage.setItem("token", token);
        setToken(token);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signin failed:", err);
      alert("Signin failed, please check your credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen 
                    bg-[url('/src/assets/download.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Outer glassy card */}
      <div className="flex flex-col items-center justify-center 
                      rounded-2xl p-10 w-[420px] bg-zinc-900/80 
                      backdrop-blur-lg shadow-[0_8px_40px_rgba(0,0,0,0.4)]
                      border border-zinc-700/40 hover:shadow-[0_12px_45px_rgba(0,0,0,0.5)] 
                      transition-all duration-300 ease-out">

        {/* Title */}
        <div className="flex flex-col items-center mb-6">
          <Heading text={"Welcome Back"} />
          <Subheading text={"Sign in to continue to your account"} />
        </div>

        {/* Input fields */}
        <div className="w-full space-y-6">
          <Inputs />
        </div>

        {/* Button */}
        <div className="flex justify-center mt-8">
          <Button
            text={"Sign In"}
            onClick={handleSignin}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 
                       text-white font-semibold text-lg px-8 py-3 rounded-xl 
                       shadow-[0_4px_20px_rgba(0,0,0,0.3)] 
                       hover:shadow-[0_6px_25px_rgba(0,0,0,0.45)] 
                       hover:scale-[1.03] active:scale-95 
                       transition-all duration-300 ease-out cursor-pointer"
          />
        </div>

        {/* Bottom link */}
        <div className="flex justify-center mt-6">
          <Bottom
            text={"Don’t have an account? "}
            link={"Sign Up"}
            url={"/signup"}
          />
        </div>
      </div>
    </div>
  );
}

function Inputs() {
  const [email, setEmail] = useRecoilState(emailState);
  const [password, setPassword] = useRecoilState(passwordState);

  return (
    <>
      <InputField
        heading={"Email"}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={"Enter your email"}
        type={"text"}
        className="w-full px-4 py-3 text-white bg-zinc-800/70 rounded-xl 
                   border border-zinc-600/40 focus:border-blue-500 
                   focus:ring-2 focus:ring-blue-400/50 
                   outline-none transition-all duration-300"
      />
      <InputField
        heading={"Password"}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={"Enter your password"}
        type={"password"}
        className="w-full px-4 py-3 text-white bg-zinc-800/70 rounded-xl 
                   border border-zinc-600/40 focus:border-blue-500 
                   focus:ring-2 focus:ring-blue-400/50 
                   outline-none transition-all duration-300"
      />
    </>
  );
}
