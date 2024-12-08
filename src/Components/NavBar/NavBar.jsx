import React, { useRef, useEffect, useState } from "react";
import LOGO from './DTEC.png';

function NavBar({ scrollToSection, homeRef, featuresRef, developersRef }) {
  const [navbarColor, setNavbarColor] = useState('bg-transparent');

  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setNavbarColor('bg-main');
    } else {
      setNavbarColor('bg-transparent');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', changeNavbarColor);
    return () => {
      window.removeEventListener('scroll', changeNavbarColor);
    };
  }, []);

  const navigateLogin = () => {
    window.location.href  = '/login-user';
  }


  return (
    <>
      <div className={`justify-between w-full h-auto flex fixed z-10 ${navbarColor} p-5 pl-16 transition-colors duration-300 scroll-smooth`}>
        <div>
          <img src={LOGO} alt="Logo" />
        </div>
        <div className="flex gap-14 items-center">
          <ul className="flex gap-10 items-center">
            {/* Prevent default behavior and use scrollToSection */}
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection(homeRef);} }>Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection(featuresRef); }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection(developersRef); }}>Team</a>
          </ul>
          <button onClick={navigateLogin} className="bg-white w-24 h-14 mr-10 hover:bg-transparent hover:border-white hover:border-2">
            Login
          </button>
        </div>
      </div>
    </>
  );
}

export default NavBar;
