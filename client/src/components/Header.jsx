import { useLocation } from "react-router-dom";

import logo from "../assets/mslogodark.svg";
import { navigation } from "../constants/index.js";
import Button from "./Button.jsx";

const Header = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="fixed top-0 left-0 w-full z-[48] bg-n-8/80 backdrop-blur-sm border-b border-n-6">
      <div className="flex justify-between items-center px-5 lg:px-7.5 xl:px-12 max-lg:py-3">
        <div className="flex gap-6">
          <a className="flex items-center" href="hero">
            <img src={logo} width={55} alt="MS Solutions" />
            <span className="text-3xl pl-3 pt-[3px] font-thin cursor-pointer select-none">SOLUTIONS</span>
          </a>
          <nav className="hidden fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent">
            <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row lg:ml-4 xl:ml-6">
              <a
                href={"dashboard"}
                className={`block relative font-code text-2xl uppercase text-n-2 transition-colors hover:text-color-1 px-6 py-6 md:py-8  lg:text-xs lg:font-semibold ${
                  pathname === "/dashboard" ? "z-2 lg:text-n-1" : "lg:text-n-1/50"
                }  lg:hover:text-n-2 xl:px-8`}
              >
                Dashboard
              </a>
              <a
                // href={"devices"}
                className={`block relative font-code text-2xl uppercase text-n-2 transition-colors hover:text-color-1 px-6 py-6 md:py-8  lg:text-xs lg:font-semibold cursor-not-allowed ${
                  pathname === "/devices" ? "z-2 lg:text-n-1" : "lg:text-n-1/50"
                }  lg:hover:text-n-2 xl:px-8`}
              >
                Geräte
              </a>
              <a
                // href={"docs"}
                className={`block relative font-code text-2xl uppercase text-n-2 transition-colors hover:text-color-1 px-6 py-6 md:py-8  lg:text-xs lg:font-semibold cursor-not-allowed ${
                  pathname === "/docs" ? "z-2 lg:text-n-1" : "lg:text-n-1/50"
                }  lg:hover:text-n-2 xl:px-8`}
              >
                Docs
              </a>
              <a
                // href={"about"}
                className={`block relative font-code text-2xl uppercase text-n-2 transition-colors hover:text-color-1 px-6 py-6 md:py-8  lg:text-xs lg:font-semibold cursor-not-allowed ${
                  pathname === "/about" ? "z-2 lg:text-n-1" : "lg:text-n-1/50"
                }  lg:hover:text-n-2 xl:px-8`}
              >
                Über uns
              </a>
            </div>
          </nav>
        </div>

        <Button className="hidden lg:flex" href="">
          Admin
        </Button>
      </div>
    </div>
  );
};

export default Header;
