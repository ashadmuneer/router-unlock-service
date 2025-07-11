import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Logo from "../../assets/Genuine Unlocker Logo.png";
import { FaWhatsapp, FaTelegramPlane, FaEnvelope } from "react-icons/fa";

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
            <Link to="/#home" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/#howtounlock" onClick={() => setMenuOpen(false)}>
              How To Unlock
            </Link>
          </li>
          <li>
            <Link to="/how-to-use-code" onClick={() => setMenuOpen(false)}>
              How to Use Code
            </Link>
          </li>
          <li>
            <Link to="/order-tracking" onClick={() => setMenuOpen(false)}>
              Order Tracking
            </Link>
          </li>
          <li>
            <Link to="/#faq" onClick={() => setMenuOpen(false)}>
              FAQ's
            </Link>
          </li>
          {/* 👇 Mobile Contact Section */}
          <li className="mobile-contact">
            <span>Contact Us</span>
            <div className="contact-icons">
              <a
                href="https://t.me/GenuineUnlock"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTelegramPlane />
              </a>
              <a
                href="https://wa.me/919140672714"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp />
              </a>
              <a href="mailto:genuineunlockerinfo@gmail.com">
                <FaEnvelope />
              </a>
            </div>
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

      {/* ✅ Desktop Contact Section */}
      <div className="contact-desktop nav-links">
        <span>Contact Us</span>
        <div className="contact-icons">
          <a
            href="https://t.me/GenuineUnlock"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegramPlane />
          </a>
          <a
            href="https://wa.me/919140672714"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
          </a>
          <a href="mailto:ashadmuneerofficial@gmail.com">
            <FaEnvelope />
          </a>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
