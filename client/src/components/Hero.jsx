import Section from "./Section";
import PlusSvg from "../assets/svg/PlusSvg";


const Hero = () => {
  return (
    <Section
      crosses
      crossesOffset="lg:translate-y-[5rem]"
      customPaddings
      id="hero"
    >
      <div className="absolute top-0 left-0 w-screen h-svh flex justify-center">
        <div className="absolute hidden min-[1921px]:block w-[1920px] h-[1080px] z-1">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0e0c15] to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0e0c15] to-transparent"></div>
        </div>

        <div className="absolute w-screen max-w-[3200px] h-[1080px] z-3 hidden min-[1921px]:block">
          <div className="absolute inset-y-0 left-0 w-28 min-[3840px]:w-64 bg-gradient-to-r from-[#0e0c15] to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-28 min-[3840px]:w-64 bg-gradient-to-l from-[#0e0c15] to-transparent"></div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-screen h-svh flex justify-center">
        <div className="absolute w-screen max-w-[3200px] h-svh max-h-[1080px] bg-radial-gradient from-green-800/20 to-transparent z-2"></div>

        <div className="w-screen max-w-[1920px] h-svh max-h-[1080px] z-0">
          <iframe
            type="text/html"
            src="/my.spline.design.htm"
            alt="background"
            width="100%"
            height="100%"
          ></iframe>
          {/* <iframe
                src="https://my.spline.design/untitled-72813e1e82edd695b1a74a1c3542c217/"
                frameborder="0"
                width="100%"
                height="100%"
                ></iframe> */}
        </div>
      </div>

      <div className="container">
        <div className="h-svh flex items-center justify-center text-center max-h-[1080px] min-h-[600px]">
          <div className="relative mx-12 z-10">
            <h1 className="h1 mb-5">Pflanzenhaltung. Überall.</h1>
            <h1 className="h2 relative -top-5 mb-6 font-semibold">
              Streamlined durch{" "}
              <span className="inline-block text-transparent gradient-text animate-gradient ">
                MS Solutions.
              </span>
            </h1>

            <p className="body-1 max-w-3xl mx-auto mb-2 text-n-2 lg:mb-4">
              Diskrete und im Topf vollständig integrierte autonome
              Pflanzenbewässerungssysteme, ausgelegt für das optimale Decken der
              Bedürfnisse von sehr vielen Pflanzen über eine verteilte Fläche.
            </p>

            <p className="body-1 max-w-3xl mx-auto text-n-2">
              Zentral verwaltet und möglichsts aufwandslos.
            </p>

            <p className="body-1 max-w-3xl mx-auto text-color-1">
              Völlig lokal.
            </p>
          </div>
        </div>
      </div>

      <div className="hidden relative z-40 top-svh left-0 right-10 h-0.25 bg-n-6 pointer-events-none xl:block">
        <PlusSvg className="hidden absolute -top-[0.3rem] left-[2.1875rem] z-40 pointer-events-none xl:block" />
        <PlusSvg className="hidden absolute -top-[0.3rem] right-[2.1875rem] z-40 pointer-events-none xl:block" />
      </div>
    </Section>
  );
};

export default Hero;
