import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// ✅ Device list
const devices = {
  "H112-370": { brand: "HUAWEI" },
  "H112-372": { brand: "HUAWEI" },
  "H122-373A": { brand: "HUAWEI" },
  "H122-373": { brand: "HUAWEI" },
  "N5368X": { brand: "HUAWEI" },
  "E6878-370": { brand: "HUAWEI" },
  "E6878-870": { brand: "HUAWEI" },
  "H153-381": { brand: "BROVI" },
  "H151-370": { brand: "BROVI" },
  "H155-381": { brand: "BROVI" },
  "H155-382": { brand: "BROVI" },
  "H155-383": { brand: "BROVI" },
  "H158-381": { brand: "BROVI" },
  "H352-381": { brand: "BROVI" },
  "E6888-982": { brand: "BROVI" },
  "H155-380": { brand: "BROVI Plus" },
  "MU5120": { brand: "ZTE" },
  "MC888": { brand: "ZTE" },
  "MC801A": { brand: "ZTE" },
  "MC888A ULTRA": { brand: "ZTE" },
  "MU5001M": { brand: "ZTE" },
  "G5C": { brand: "ZTE" },
  "MC801A1": { brand: "ZTE" },
  "T1A-CTC03": { brand: "OPPO" },
  "T2-CTD05": { brand: "OPPO" },
  "H138-380": { brand: "GHTelcom" },
  "SRT873": { brand: "Soyealink" },
  "SRT875": { brand: "Soyealink" },
  "D5H-250MK": { brand: "GreenPacket" },
  "D5H-EA20/EA60/EA62": { brand: "GreenPacket" },
  "Y5-210MU": { brand: "GreenPacket" },
  "WQRTM-838A": { brand: "AVXAV" },
  "C082 PRO": { brand: "AURORA" },
  "DWR-2000M": { brand: "D-Link" },
  "AX3600": { brand: "FIBOCOM" },
  "IC5989": { brand: "TD TECH" },
  "T1A-CTC02": { brand: "OPPO" },
  "AOD311NK": { brand: "NOKIA" },
  "RM500Q-AE": { brand: "QUECTEL" },
  "H165-383": { brand: "BROVI" },
  "T1A-CTB06": { brand: "OPPO" },
  "T1A-CTB03": { brand: "OPPO" },
  "A50E": { brand: "MEIGLINK" },
  "FASTMILE 5G GATEWAY 3.2": { brand: "NOKIA" },
  "FASTMILE 5G GATEWAY 3.1": { brand: "NOKIA" },
  "RG50OL-EU": { brand: "QUECTEL" },
  "X21": { brand: "ZLT" },
  "MU5001A/B/M/U/MU5002": { brand: "ZTE" },
  "AW1000": { brand: "TELSTRA" },
  "CP52": { brand: "FLYBOX" },
  "TestModel": { brand: "TestBrand" },
  "Archer NX200": { brand: "TP-Link" },
  "Deco X50-5G": { brand: "Deco" },
  "SRT873HS": { brand: "Soyealink" },
  "5G19-01W-A": { brand: "Flybox" },
  "SLT869-A51": { brand: "Soyealink" }
};

const DevicePage = () => {
  const { brand, model } = useParams();
  const device = devices[model];

  if (!device || device.brand.toLowerCase() !== brand.toLowerCase()) {
    return <p>Device not found</p>;
  }

  return (
    <>
      <Helmet>
        <title>{`${device.brand} ${model} Unlock | GenuineUnlocker`}</title>
        <meta
          name="description"
          content={`Unlock ${device.brand} ${model} routers, modems, and WiFi devices quickly and safely with GenuineUnlocker.`}
        />
      </Helmet>

      <div
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          padding: "20px",
          fontFamily: "'Segoe UI', Arial, sans-serif",
          color: " #702083",
        }}
      >
        {/* ✅ BUY BUTTON */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <a
            href="https://genuineunlocker.net/"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "15px 30px",
              backgroundColor: "#702083",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.2em",
              borderRadius: "10px",
              textDecoration: "none",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            BUY ROUTER UNLOCK CODE NOW
          </a>
        </div>

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
                  fontWeight: 600,
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
              "Enter the 16-digit code received via email and click submit.",
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

export default DevicePage;
