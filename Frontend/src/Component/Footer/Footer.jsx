import React from "react";
import "./Footer.css";
import Logo from '../../assets/Genuine Unlocker Logo.png'

const Footer = () => {
  return (
    <footer>
      <div className="container footer-container">
        <div className="col-3">
          <img
            src={Logo}
            alt="Logo"
          />
          <br />
          <div className="social">
            <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
            <a href="#"><i className="fa-brands fa-twitter"></i></a>
            <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          <br />
          {/* <span className="address">Address: somewhere over the rainbow</span> */}
        </div>

        <div className="col-3">
          <h6>About</h6>
          <p style={{ textAlign: "justify", fontSize: "0.5rem" }}>
            At GenuineUnlocker, we are dedicated to providing fast, reliable, and legal WiFi router unlocking services to customers worldwide. Our mission is to empower you to use your router with any compatible network, giving you the freedom and flexibility to stay connected without restrictions.
          </p>
        </div>

        <div className="col-3">
          <h6>Get Help</h6>
          <a href="https://wa.me/966571749463" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i>Whatsapp Help Line</a>
        </div>

        <div className="col-3">
          <h6>Contact</h6>
          <a href="#">mailme@gmail.com</a>
        </div>
      </div>

      <div className="copyright">
        Copyright &#169; 2024 | Footerpen All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
