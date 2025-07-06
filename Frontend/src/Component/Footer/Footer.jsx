import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import Logo from '../../assets/Logo2.png'
const Footer = () => {
  return (
    <footer>
      <div className="container footer-container">
        <div className="col-3">
          <img src={Logo} alt="Genuine Unlocker Logo" className="footer-logo" />
          {/* <div className="social">
            <a href="#" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div> */}
        </div>

        <div className="col-3">
          <h6>Quick Links</h6>
          <ul>
            <li>
              <Link to="/about" className="footer-link">About Us</Link>
            </li>
            <li>
              <Link to="/terms" className="footer-link">Terms and Conditions</Link>
            </li>
          </ul>
        </div>

        <div className="col-3">
          <h6>For Any Inquiries, Contact Us</h6>
          <ul>
            <li>
              <a href="https://wa.me/919140672714" target="_blank" rel="noopener noreferrer" className="footer-link">
                <i className="fa-brands fa-whatsapp"></i> WhatsApp
              </a>
            </li>
            <li>
              <a href="mailto:genuineunlockerinfo@gmail.com" className="footer-link">
                <i className="fa-solid fa-envelope"></i> Email
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="copyright">
        Copyright © 2025 | GenuineUnlocker All rights reserved
      </div>
    </footer>
  );
};

export default Footer;