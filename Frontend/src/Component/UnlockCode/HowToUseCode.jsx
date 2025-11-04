import React from "react";
import { Helmet } from "react-helmet-async";

const HowToUseCode = () => {
  return (
    <>
      <Helmet>
        <title>How to Use Your Router Unlock Code | GenuineUnlocker</title>
        <meta
          name="description"
          content="A step-by-step guide on how to use the unlock code for your router or modem. Follow these simple instructions to unlock your device."
        />
        <link rel="canonical" href="https://genuineunlocker.net/how-to-use-code" />
      </Helmet>
      <div
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          padding: "20px",
          //   background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          //   borderRadius: '20px',
          //   boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          fontFamily: "'Segoe UI', Arial, sans-serif",
          color: " #702083",
        }}
      >
        <h1
          style={{
            fontSize: "2.5em",
            fontWeight: 700,
            textAlign: "center",
            color: " #702083",
            marginBottom: "30px",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          Unlock Your Router
        </h1>

        <section
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "30px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "1.8em",
              color: " #702083",
              marginBottom: "20px",
              borderBottom: "2px solid  #702083",
              paddingBottom: "10px",
            }}
          >
            Why Unlock Your Router?
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              fontSize: "1.1em",
              lineHeight: "1.8",
              fontWeight: 600,
            }}
          >
            {[
              "Use SIM cards from different network providers",
              "Take advantage of better network coverage",
              "Avoid roaming charges when traveling by using a local SIM card",
              "Increase the resale value of your router",
            ].map((item, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                  padding: "10px",
                  background: "rgba(52, 152, 219, 0.1)",
                  borderRadius: "10px",
                  transition: "transform 0.3s ease",
                  ":hover": {
                    transform: "translateX(10px)",
                  },
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "30px",
                    height: "30px",
                    color: "#702083",
                    borderRadius: "50%",
                    textAlign: "center",
                    lineHeight: "30px",
                    marginRight: "15px",
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}.
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "1.8em",
              color: " #702083",
              marginBottom: "20px",
              borderBottom: "2px solid  #702083",
              paddingBottom: "10px",
            }}
          >
            Steps to Unlock Your Router
          </h2>
          <ol
            style={{
              paddingLeft: "20px",
              fontSize: "1.1em",
              lineHeight: "1.8",
            }}
          >
            {[
              "Power OFF your Router.",
              "Insert SIM card from any different network provider.",
              "Power ON your Router after inserting the SIM card.",
              "Connect it to your computer or smartphone via LAN cable or Wi-Fi.",
              "Open your web browser, type the IP address (http://192.168.8.1 or http://192.168.0.1) in the address bar, and press Enter.",
              "Enter the 8 or 16-digit code received via email and click submit.",
              "Log in to the web interface using the default credentials unless previously changed.",
            ].map((step, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  background: "rgba(52, 152, 219, 0.05)",
                  borderLeft: "4px solid  #702083",
                  borderRadius: "5px",
                  transition: "background 0.3s ease",
                  fontWeight: 600,
                }}
              >
                {step}
              </li>
            ))}
          </ol>
        </section>

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            fontSize: "0.9em",
            color: " #702083",
          }}
        >
          <p>
            Follow these steps carefully to unlock your router and enjoy the
            freedom of choosing your network provider!
          </p>
        </div>
      </div>
    </>
  );
};

export default HowToUseCode;
