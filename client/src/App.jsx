import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth <= 1024) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <>
      <div className="overflow-hidden">
        <Header />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
