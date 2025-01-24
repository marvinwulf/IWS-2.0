import { useLocation } from "react-router-dom";

import logo from "../assets/mslogodark.svg";
import { navigation } from "../constants/index.js";
import Button from "./Button.jsx";

const Header = () => {
  const pathname = useLocation();

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-n-8/80 backdrop-blur-sm border-b border-n-6">
      <div className="flex justify-between items-center px-5 lg:px-7.5 xl:px-12 max-lg:py-3">
        <div className="flex gap-6">
          <a className="flex items-center" href="#hero">
            <img src={logo} width={55} alt="MS Solutions" />
            <text className="text-3xl pl-3 pt-[3px] font-thin cursor-pointer select-none">
              SOLUTIONS
            </text>
          </a>
          <nav className="hidden fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent">
            <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row lg:ml-4 xl:ml-6">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-6 py-6 md:py-8  lg:text-xs lg:font-semibold ${
                    item.url === pathname.hash
                      ? "z-2 lg:text-n-1"
                      : "lg:text-n-1/50"
                  }  lg:hover:text-n-1 xl:px-8`}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </nav>
        </div>

        <Button className="hidden lg:flex" href="#login">
          Login
        </Button>
      </div>
    </div>
  );
};

export default Header;
