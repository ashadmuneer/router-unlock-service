import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About GenuineUnlocker</h1>

        <section>
          <h2>Our Mission</h2>
          <p>
            At GenuineUnlocker, we are dedicated to providing fast, reliable, and legal WiFi router unlocking services to customers worldwide. Our mission is to empower you to use your router with any compatible network, giving you the freedom and flexibility to stay connected without restrictions.
          </p>
        </section>

        <section>
          <h2>Who We Are</h2>
          <p>
            GenuineUnlocker is a trusted provider of router unlocking solutions, specializing in sourcing and delivering unlock codes and services for a wide range of WiFi router brands and models. Based in London, UK, we serve customers across Europe, North America, and beyond, ensuring a seamless and secure unlocking experience.
          </p>
        </section>

        <section>
          <h2>What We Do</h2>
          <p>
            We offer professional unlocking services to remove network restrictions from your WiFi router, allowing you to use it with any compatible SIM card or network provider. Our services include:
          </p>
          <ul>
            <li><strong>Network Lookup:</strong> We verify your router’s compatibility and eligibility for unlocking.</li>
            <li><strong>Unlock Codes:</strong> We provide clear, step-by-step instructions and codes to unlock your device.</li>
            <li><strong>Expert Support:</strong> Our team is available to guide you through the process, ensuring success.</li>
          </ul>
        </section>

        <section>
          <h2>Why Choose GenuineUnlocker?</h2>
          <ul>
            <li><strong>100% Money Back Guarantee:</strong> We stand by our services with a commitment to quality and customer satisfaction.</li>
            <li><strong>Secure Transactions:</strong> Payments are processed securely in GBP, EUR, or USD through trusted providers.</li>
            <li><strong>Fast Delivery:</strong> Unlock codes and solutions are delivered within network-provided timelines.</li>
            <li><strong>Legal and Transparent:</strong> Our services comply with regulations in Europe and North America, and we maintain full transparency with our customers.</li>
          </ul>
        </section>

        <section>
          <h2>Our Commitment to You</h2>
          <p>
            We understand the importance of staying connected in today’s world. That’s why we strive to make the unlocking process simple, affordable, and reliable. Every order is handled with care, and we prioritize your privacy by securely storing your personal details and never sharing them without consent.
          </p>
        </section>

        <section>
          <h2>Get in Touch</h2>
          <p>
            Have questions or need assistance? Our dedicated support team is here to help. Contact us via{' '}
            <a href="mailto:genuineunlockerinfo@gmail.com" target='_blank' className="about-link">genuineunlockerinfo@gmail.com</a>{' '}
            or explore our <Link to="/#faq" className="about-link">FAQ's</Link> for more information.
          </p>
        </section>

        <p className="thank-you">
          Thank you for choosing GenuineUnlocker your trusted partner in unlocking connectivity.
        </p>
      </div>
    </div>
  );
};

export default About;