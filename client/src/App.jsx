import ButtonGradient from "./assets/svg/ButtonGradient";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <>
      <div className="overflow-hidden">
        <Header />
        <Routes>
          <Route path="/hero" element={<Hero />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
