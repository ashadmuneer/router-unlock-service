import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UnlockSection.css";
import BrandLogo from "../../assets/Brandlogo.png";

const routerData = {
  networks: ["STC", "ZAIN", "MOBILY", "GO", "Other"],
  brands: [
    "Huawei",
    "Greenpacket",
    "Soyealink",
    "GHTelcom",
    "Oppo",
    "ZTE",
    "Brovi",
  ],
  models: {
    Huawei: ["H112-370", "H112-372", "H122-373", "E6878-370", "E6878-870"],
    Greenpacket: ["D5H-250MK", "D5H-EA20"],
    Soyealink: ["SRT875"],
    GHTelcom: ["H138-380"],
    Oppo: ["T1a (CTC03)", "T2 (CTD05)"],
    ZTE: ["MC801A", "MC801A1"],
    Brovi: [
      "H153-381",
      "H155-380",
      "H155-381",
      "H155-382",
      "H155-383",
      "H158-381",
      "H352-381",
    ],
  },
};

const tacRouterDB = {
  86720604: { brand: "HUAWEI", model: "H112-720" },
  86073004: { brand: "HUAWEI", model: "H112-372" },
  86193505: { brand: "HUAWEI", model: "H122-373-A" },
  86688704: { brand: "HUAWEI", model: "H122-373" },
  86406705: { brand: "HUAWEI", model: "N5368X" },
  86597804: { brand: "HUAWEI", model: "E6878-370" },
  86037604: { brand: "HUAWEI", model: "E6878-870" },
  86584007: { brand: "Brovi", model: "H153-381" },
  86124107: { brand: "Brovi", model: "H151-370" },
  86075606: { brand: "Brovi", model: "H155-381" },
  86681507: { brand: "Brovi", model: "H155-381" },
  86688806: { brand: "Brovi", model: "H155-382" },
  86241607: { brand: "Brovi", model: "H155-383" },
  86717306: { brand: "Brovi", model: "H158-381" },
  86120006: { brand: "Brovi", model: "H352-381" },
  86968607: { brand: "Brovi", model: "E6888-982" },
  86015506: { brand: "ZTE", model: "MU5120" },
  86581106: { brand: "ZTE", model: "MC888" },
  86367104: { brand: "ZTE", model: "MC801A" },
  86556005: { brand: "ZTE", model: "MC801A" },
  86156906: { brand: "ZTE", model: "MC888A ULTRA" },
  86992605: { brand: "ZTE", model: "MU5001M" },
  86062806: { brand: "ZTE", model: "MC801A1" },
  86160006: { brand: "ZTE", model: "MC801A1" },
  86583105: { brand: "Oppo", model: "T1A (CTC03)" },
  86264406: { brand: "Oppo", model: "T1A (CTC03)" },
  86782206: { brand: "Oppo", model: "T2 (CTD05)" },
  86481205: { brand: "GHTelcom", model: "H138-380" },
  86588106: { brand: "Soyealink", model: "SRT873" },
  86399806: { brand: "Soyealink", model: "SRT875" },
  35840799: { brand: "GreenPacket", model: "D5H-250MK" },
  35162435: { brand: "GreenPacket", model: "D5H-EA20" },
  35759615: { brand: "GreenPacket", model: "Y5-210MU" },
};

const UnlockSection = () => {
  const [imei, setImei] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [customNetwork, setCustomNetwork] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [error, setError] = useState("");
  const [showSecondPart, setShowSecondPart] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle IMEI input: allow only numbers, max 15 digits
  const handleImeiChange = (e) => {
    const value = e.target.value;
    // Allow only digits and limit to 15 characters
    if (/^\d{0,15}$/.test(value)) {
      setImei(value);
    }
  };

  // Handle Serial Number input: allow only capital letters and numbers, max 20 characters
  const handleSerialNumberChange = (e) => {
    const value = e.target.value.toUpperCase(); // Force uppercase
    // Allow only alphanumeric characters and limit to 20 characters
    if (/^[A-Z0-9]{0,20}$/.test(value)) {
      setSerialNumber(value);
    }
  };

  useEffect(() => {
    if (imei.length >= 8) {
      const tac = imei.substring(0, 8);
      const routerInfo = tacRouterDB[tac];
      if (routerInfo && /^\d{15}$/.test(imei)) {
        setSelectedBrand(routerInfo.brand);
        setSelectedModel(routerInfo.model);
      } else {
        setSelectedBrand("");
        setSelectedModel("");
      }
    } else {
      setSelectedBrand("");
      setSelectedModel("");
    }
  }, [imei]);

  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (!imei || !selectedBrand || !selectedModel || !selectedNetwork) {
      setError("Please fill in all fields in this section");
      return;
    }

    if (!/^\d{15}$/.test(imei)) {
      setError("IMEI must be exactly 15 digits");
      return;
    }

    if (selectedNetwork === "Other" && !customNetwork) {
      setError("Please enter a network name");
      return;
    }

    setShowSecondPart(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!serialNumber || !email || !termsAccepted) {
      setError(
        "Please fill in all fields and agree to the terms and conditions"
      );
      setLoading(false);
      return;
    }

    if (!/^[A-Z0-9]{1,20}$/.test(serialNumber)) {
      setError(
        "Serial number must be alphanumeric (capital letters and numbers) and up to 20 characters"
      );
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const networkToSubmit =
      selectedNetwork === "Other" ? customNetwork : selectedNetwork;


    const url = `${import.meta.env.VITE_API_URL}/api/create-order`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: selectedBrand,
          model: selectedModel,
          network: networkToSubmit,
          imei,
          serialNumber,
          mobileNumber,
          email,
          termsAccepted,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      const data = await response.json();

      if (data.orderId) {
        navigate(`/order/${data.orderId}`);
      } else {
        setError("Order created, but no orderId received");
        console.error("Missing orderId in response", data);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="unlock-section">
      <h1>
        <span className="highlight">Unlock your Wifi router</span> today with{" "}
        <span className="highlight">Genuine Unlocker</span>
      </h1>
      <h2>
        Remote Unlocking <span className="via">via IMEI</span>
      </h2>
      <p>
        Need to unlock your router to use it with different carriers? Our
        professional unlocking service makes the process simple and hassle-free.
        With experience across a wide range of router brands and models, we
        ensure your device is unlocked safely and efficiently. Enjoy the
        flexibility to switch between internet service providers without
        limitations, all from the comfort of your home.
      </p>

      {error && <p className="error-message">{error}</p>}

      <div id="unlock-area">
        <div className="unlock-form">
          {!showSecondPart ? (
            <>
              <div className="imei-input">
                <label htmlFor="imei" className="imei-label">
                  IMEI Number
                </label>
                <input
                  type="text"
                  id="imei"
                  placeholder="Enter the 15-digit IMEI number"
                  value={imei}
                  onChange={handleImeiChange}
                  maxLength={15} // Enforce max length in UI
                />
                {imei.length > 0 && (
                  <p
                    style={{
                      color:
                        /^\d{15}$/.test(imei) &&
                        tacRouterDB[imei.substring(0, 8)]
                          ? "#45ff45"
                          : "red",
                      fontSize: "1rem",
                      lineHeight: "1.7",
                      maxWidth: "600px",
                      fontWeight: "700",
                    }}
                  >
                    {/^\d{15}$/.test(imei) && tacRouterDB[imei.substring(0, 8)]
                      ? "IMEI is verified and brand and model are auto-selected"
                      : imei.length < 15
                      ? "Please enter exactly 15 digits"
                      : "Please enter Brand and Model manually"}
                  </p>
                )}
              </div>

              {(imei.length < 15 || !tacRouterDB[imei.substring(0, 8)]) && (
                <>
                  <label htmlFor="brand">Enter Brand</label>
                  <input
                    type="text"
                    id="brand"
                    placeholder="e.g. Huawei"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  />

                  <label htmlFor="model">Enter Model</label>
                  <input
                    type="text"
                    id="model"
                    placeholder="e.g. H112-370"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  />
                </>
              )}

              {imei.length >= 15 && tacRouterDB[imei.substring(0, 8)] && (
                <>
                  <label>Selected Brand</label>
                  <input
                    type="text"
                    value={selectedBrand || "Auto-selected"}
                    readOnly
                  />

                  <label>Selected Model</label>
                  <input
                    type="text"
                    value={selectedModel || "Auto-selected"}
                    readOnly
                  />
                </>
              )}

              <label htmlFor="network">Select Network</label>
              <select
                id="network"
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
              >
                <option value="">-- Select Network --</option>
                {routerData.networks.map((network) => (
                  <option key={network} value={network}>
                    {network}
                  </option>
                ))}
              </select>

              {selectedNetwork === "Other" && (
                <>
                  <label htmlFor="customNetwork">Write Network Name</label>
                  <input
                    type="text"
                    id="customNetwork"
                    placeholder="e.g. Custom Network"
                    value={customNetwork}
                    onChange={(e) => setCustomNetwork(e.target.value)}
                  />
                </>
              )}

              <button
                className="unlock-button"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? "Processing..." : "Unlock Now 🔑"}
              </button>
            </>
          ) : (
            <>
              <label htmlFor="serialNumber">Enter S/N</label>
              <input
                type="text"
                id="serialNumber"
                placeholder="Enter the serial number"
                value={serialNumber}
                onChange={handleSerialNumberChange}
                maxLength={20} // Enforce max length in UI
              />

              <label htmlFor="email">Enter Email</label>
              <input
                type="email"
                id="email"
                placeholder="e.g. example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="mobileNumber">Enter WhatsApp Number</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <select
                  value={mobileNumber.startsWith("+966") ? "+966" : "+91"}
                  onChange={(e) =>
                    setMobileNumber(
                      (prev) => e.target.value + prev.replace(/^\+?\d{1,4}/, "")
                    )
                  }
                >
                  <option value="+966">🇸🇦 +966 (KSA)</option>
                  <option value="+91">🇮🇳 +91 (India)</option>
                  <option value="+971">🇦🇪 +971 (UAE)</option>
                  <option value="+1">🇺🇸 +1 (USA)</option>
                </select>
                <input
                  type="tel"
                  id="mobileNumber"
                  placeholder="Enter number"
                  value={mobileNumber.replace(/^\+?\d{1,4}/, "")}
                  onChange={(e) =>
                    setMobileNumber((prev) => {
                      const code = prev.match(/^\+?\d{1,4}/)?.[0] || "+966";
                      return code + e.target.value.replace(/\D/g, "");
                    })
                  }
                />
              </div>

              <div className="terms-checkbox">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms">
                  I agree to the{" "}
                  <span
                    className="terms-link"
                    onClick={() => setShowTermsPopup(true)}
                  >
                    Terms and Conditions clouds{" "}
                  </span>
                </label>
              </div>

              {showTermsPopup && (
                <div className="terms-popup">
                  <div
                    className="terms-popup-content"
                    style={{
                      maxHeight: "80vh",
                      overflowY: "auto",
                      paddingRight: "1rem",
                    }}
                  >
                    <div>
                      <h1>Terms and Conditions for GenuineUnlocker</h1>
                      <p>
                        Your purchase will appear on your card statements as{" "}
                        <strong>GENUINEUNLOCKER</strong>. Goods are sold in GBP
                        (£), EUR (€), and USD ($).
                      </p>
                      <p>
                        By placing an order with GenuineUnlocker.com, you
                        confirm your agreement to the following Terms and
                        Conditions:
                      </p>

                      <h2>1. Description of Service</h2>
                      <ul>
                        <li>
                          <strong>1.1 Service Commencement:</strong> The service
                          of sourcing and supplying any unlock solution for WiFi
                          routers begins immediately upon receipt of payment.
                        </li>
                        <li>
                          <strong>1.2 Network Lookup Services:</strong> We offer
                          network lookup services to determine compatibility and
                          unlock eligibility.
                        </li>
                      </ul>

                      <h2>
                        2. The rest of the terms and conditions are unchanged
                      </h2>
                    </div>
                    <button onClick={() => setShowTermsPopup(false)}>
                      Close
                    </button>
                  </div>
                </div>
              )}

              <button
                className="unlock-button"
                onClick={handleSubmit}
                disabled={loading || !termsAccepted}
              >
                {loading ? "Submitting..." : "Proceed to Checkout 🛒"}
              </button>
              <button
                className="back-button"
                onClick={() => setShowSecondPart(false)}
              >
                Back
              </button>
            </>
          )}
        </div>

        <div className="unlock-image">
          <div className="image-glow-wrapper">
            <img src={BrandLogo} alt="People using phone" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnlockSection;
