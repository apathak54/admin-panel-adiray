import { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/adiray_logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-16 h-16 rounded-sm" />
          <Link to="https://adirayglobal.com/" className="text-white font-extrabold text-yellow-100 text-lg hover:text-yellow-400 transition duration-300 cursor-pointer">
            Adiray
          </Link>
        </div>
        <div className="md:hidden flex items-center justify-center">
          <button onClick={toggleNavbar} className="text-white focus:outline-none">
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-100 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
        <div className={`${isOpen ? 'block' : 'hidden'} md:block `}>
          <div className="flex items-center gap-8">
            <Link to="/" className="relative font-semibold text-white cursor-pointer text-[17px] w-fit md:block after:block after:content-[''] after:absolute after:h-[3px] after:bg-yellow-400 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center hover:text-yellow-400 text-yellow-100">
              Blog
            </Link>
            <Link to="/" className="relative font-semibold text-white cursor-pointer text-[17px] w-fit md:block after:block after:content-[''] after:absolute after:h-[3px] after:bg-yellow-400 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center text-yellow-100 hover:text-yellow-400">
              Products
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
