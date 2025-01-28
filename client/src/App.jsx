import ButtonGradient from "./assets/svg/ButtonGradient";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";

const App = () => {
  

  return (
    <>
      <div className="overflow-hidden">
        <Header />
        {/* <Hero /> */}
        <Dashboard />
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
