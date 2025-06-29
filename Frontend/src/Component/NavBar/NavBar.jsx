import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Logo from "../../assets/Genuine Unlocker Logo.png";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header>
      <div className="logo">
        <Link to="/#home" onClick={() => setMenuOpen(false)}>
          <img src={Logo} alt="Genuine Unlocker Logo" />
        </Link>
      </div>

      <nav id="nav" className={menuOpen ? "open" : ""}>
        <ul className="nav-links">
          <li>
            <Link to="/#home" onClick={() => setMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/#howtounlock" onClick={() => setMenuOpen(false)}>How To Unlock</Link>
          </li>
          <li>
            <Link to="/order-tracking" onClick={() => setMenuOpen(false)}>Order Tracking</Link>
          </li>
          <li>
            <Link to="/#faq" onClick={() => setMenuOpen(false)}>FAQ's</Link>
          </li>
        </ul>
      </nav>

      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
};

export default NavBar;
