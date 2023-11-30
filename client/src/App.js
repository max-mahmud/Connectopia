import { Route, Routes } from "react-router-dom";
import { Home, Login, Profile, Register, ResetPassword } from "./pages";
import { useSelector } from "react-redux";
import ProtechUser from "./components/ProtechUser";

function App() {
  const { theme } = useSelector((state) => state.theme);
  const { token } = useSelector((state) => state.user);
  // console.log(token);
  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
        <Route path="/" element={<ProtechUser />}>
          <Route path="" element={<Home />} />
          <Route path="/profile/:id?" element={<Profile />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login token={token} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
