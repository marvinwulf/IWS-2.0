import ButtonGradient from "./assets/svg/ButtonGradient";
import Header from "./components/Header";
import Hero from "./components/Hero";

const App = () => {
  return (
    <>
      <div className="overflow-hidden">
        <Header />
        <Hero />
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
