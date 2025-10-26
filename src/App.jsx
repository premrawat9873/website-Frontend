import { Routes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { tokenState } from "./components/atoms/tokenAtom";
import Dashboard from "./components/Web Component/dashboard";
import Signin from "./components/Web Component/signin";
import Signup from "./components/Web Component/signup";
import Payment from "./components/Web Component/payment";

function App() {
  const token = useRecoilValue(tokenState);

  return (
    <Routes>
      {!token ? (
        <>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/signin" />} />
        </>
      ) : (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
