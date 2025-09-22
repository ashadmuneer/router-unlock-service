import React from "react";
import { Link } from "react-router-dom";

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
  "Archer NX200": { brand: "TP-Link" },
  "Deco X50-5G": { brand: "Deco" },
  "SRT873HS": { brand: "Soyealink" },
  "5G19-01W-A": { brand: "Flybox" },
  "SLT869-A51": { brand: "Soyealink" }
};


const AllDevices = () => (
  <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "'Segoe UI', Arial, sans-serif", color: "#702083" }}>
    <h2 style={{ fontSize: "2em", marginBottom: "20px", textAlign: "center", textTransform: "uppercase" }}>All Devices</h2>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {Object.entries(devices).map(([model, { brand }]) => (
        <li key={model} style={{ marginBottom: "12px" }}>
          <Link
            to={`/device/${brand}/${model}`}
            style={{
              display: "block",
              padding: "12px 15px",
              background: "#f9f9f9",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#702083",
              fontWeight: 600,
              transition: "background 0.3s, transform 0.2s",
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "#e6d0f5";
              e.currentTarget.style.transform = "translateX(5px)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "#f9f9f9";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            {brand} {model} Unlock
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default AllDevices;
