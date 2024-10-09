import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaInfoCircle, FaQuestionCircle, FaEnvelope } from "react-icons/fa"; // Import icons
import logo from '../../assets/logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkLeft = [
    { path: '/home', display: 'HOME', icon: <FaHome /> },
    { path: '/about', display: 'ABOUT US', icon: <FaInfoCircle /> },
    { path: '/faq', display: 'FAQ', icon: <FaQuestionCircle /> },
    { path: '/contact', display: 'CONTACT US', icon: <FaEnvelope /> },
  ];

  return (
    <>
      <header className="bg-customBlue text-white shadow-lg">
        <div className="container mx-auto px-[80px] py-4 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <img src={logo} alt="Land Registry Logo" className="w-12 h-12 mr-2" />
            <div className="text-3xl font-bold">
              <NavLink
                to="/"
                className="text-white hover:text-blue-400 transition duration-300 
                  text-4xl font-light tracking-wider 
                  shadow-md hover:shadow-lg transform hover:scale-105 
                  font-cursive"
              >
                Land Registry
              </NavLink>
            </div>
          </div>

          {/* Hamburger Menu for small screens */}
          <button
            className="md:hidden block text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              ></path>
            </svg>
          </button>

          {/* Navigation Links */}
          <nav
            className={`${isOpen ? "block" : "hidden"} md:flex md:items-center md:space-x-10 text-lg`}
          >
            {navLinkLeft.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                className="block py-2 md:py-0 hover:text-gray-200 transition duration-300 flex items-center space-x-2 group relative"
                activeClassName="text-blue-400"
              >
                <div className="absolute left-2 bottom-0 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 
                  transform transition-transform duration-600 ease-out origin-left"
                ></div>
                {/* Only show the icon on small screens */}
                <span className="block md:hidden">{link.icon}</span>
                <span>{link.display}</span>
              </NavLink>
            ))}
          </nav>
          <button  className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-slate-700 active:bg-slate-900 rounded-full md:inline-flex " >0xdD2FD458....</button>
        </div>
      </header>

      {/* Thin horizontal line below header */}
      <hr className="h-[1px] border-gray-800 opacity-100" />

    </>
  );
};

export default Header;
