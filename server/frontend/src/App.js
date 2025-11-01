import { Routes, Route } from "react-router-dom";
import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dealers from "./components/Dealers/Dealers"; 
import Dealer from "./components/Dealers/Dealer";    

function App() {
  return (
    <Routes>
      {/*  Route for Login */}
      <Route path="/login" element={<LoginPanel />} />

      {/*  Route for Register */}
      <Route path="/register" element={<Register />} />

      {/*  Route for Dealers */}
      <Route path="/dealers" element={<Dealers />} />

      {/* ✅ Route for individual Dealer page */}
      <Route path="/dealer/:id" element={<Dealer />} />
    </Routes>
  );
}

export default App;
