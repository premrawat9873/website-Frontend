import { useRecoilState, useRecoilValue,useSetRecoilState } from "recoil";
import Heading from "../heading";
import { tokenState } from "../atoms/tokenAtom"; // Import tokenState
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
  const setToken = useSetRecoilState(tokenState); // Add this line
  const navigate = useNavigate();

  const handleSignin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/v1/users/signin", {
        username: email,
        password
      });

      if (res.data.token || res.data.tokken || res.data.Tokken) {
        const token = res.data.token || res.data.tokken || res.data.Tokken;
        localStorage.setItem("token", token);
        setToken(token); // This is the key line you're missing!
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signin failed:", err);
      alert("Signin failed, please check your credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[url('/src/assets/download.jpg')] bg-cover">
      <div className="flex flex-col rounded-xl h-96 w-100 bg-zinc-800/80 backdrop-blur-md ">
        <div className="flex justify-center">
          <Heading text={"Sign In"} />
        </div>
        <div>
          <Subheading text={"Enter your information to Login"} />
        </div>
        <div className="pl-4 pr-4 space-y-4">
          <Inputs />
        </div>
        <div className="flex justify-center items-center pt-4">
          <Button text={"Sign In"} onClick={handleSignin} />
        </div>
        <div className="flex justify-center items-center ">
          <Bottom
            text={"Donot have an account? "}
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
        placeholder={"Email"}
        type={"text"}
      />
      <InputField
        heading={"Password"}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={"Password"}
        type={"password"}
      />
    </>
  );
}
