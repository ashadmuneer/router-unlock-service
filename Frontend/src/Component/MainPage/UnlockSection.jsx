import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UnlockSection.css";
import BrandLogo from "../../assets/Brandlogo.png";

const routerData = {
  networks: ["STC", "ZAIN", "MOBILY", "GO"],
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
  86769804: { brand: "Huawei", model: "H112-370" },
  86769806: { brand: "Huawei", model: "H112-372" },
  86769808: { brand: "Huawei", model: "H122-373" },
  86769801: { brand: "Huawei", model: "E6878-370" },
  86769803: { brand: "Huawei", model: "E6878-870" },
  35227310: { brand: "Greenpacket", model: "D5H-250MK" },
  35227311: { brand: "Greenpacket", model: "D5H-EA20" },
  86098804: { brand: "Soyealink", model: "SRT875" },
  86298900: { brand: "GHTelcom", model: "H138-380" },
  86380305: { brand: "Oppo", model: "T1a (CTC03)" },
  86380307: { brand: "Oppo", model: "T2 (CTD05)" },
  86475904: { brand: "ZTE", model: "MC801A" },
  86475906: { brand: "ZTE", model: "MC801A1" },
  86111101: { brand: "Brovi", model: "H153-381" },
  86111102: { brand: "Brovi", model: "H155-380" },
  86111103: { brand: "Brovi", model: "H155-381" },
  86111104: { brand: "Brovi", model: "H155-382" },
  86111105: { brand: "Brovi", model: "H155-383" },
  86111106: { brand: "Brovi", model: "H158-381" },
  86111107: { brand: "Brovi", model: "H352-381" },
};

const UnlockSection = () => {
  const [imei, setImei] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [error, setError] = useState("");
  const [showSecondPart, setShowSecondPart] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setError("IMEI must be 15 digits");
      return;
    }

    setShowSecondPart(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!serialNumber || !mobileNumber || !email || !termsAccepted) {
      setError(
        "Please fill in all fields and agree to the terms and conditions"
      );
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      setError("Mobile number must be 10 digits");
      setLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(serialNumber)) {
      setError("Serial number must be alphanumeric");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    console.log("Submitting order:", {
      brand: selectedBrand,
      model: selectedModel,
      network: selectedNetwork,
      imei,
      serialNumber,
      mobileNumber,
      email,
      termsAccepted,
    });

    try {
      const response = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand: selectedBrand,
          model: selectedModel,
          network: selectedNetwork,
          imei,
          serialNumber,
          mobileNumber,
          email,
          termsAccepted,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.orderId) {
          navigate(`/order/${data.orderId}`);
        } else {
          setError("Order created, but no orderId received");
          console.error("Missing orderId in response", data);
        }
      } else {
        setError(data.error || "Failed to create order");
        console.error("API error:", data.error);
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
                  placeholder="e.g. 867698041234567"
                  value={imei}
                  onChange={(e) => setImei(e.target.value)}
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
                      ? "Please enter full IMEI number"
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
                placeholder="e.g. 867xxxxxxxxxxxx"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />

              <label htmlFor="mobileNumber">Enter WhatsApp Number</label>
              <input
                type="text"
                id="mobileNumber"
                placeholder="e.g. 89xxxxxxxx"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
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
                    Terms and Conditions
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

                      <h2>2. Cancellation</h2>
                      <ul>
                        <li>
                          <strong>2.1 Order Immutability:</strong> Orders cannot
                          be canceled once payment is made.
                        </li>
                      </ul>

                      <h2>3. Legality of Service</h2>
                      <ul>
                        <li>
                          <strong>3.1 Regional Compliance:</strong> Services are
                          legal in Europe and North America. Customers outside
                          must verify local compliance.
                        </li>
                      </ul>

                      <h2>4. Assumptions</h2>
                      <ul>
                        <li>
                          <strong>4.1 Customer Due Diligence:</strong> Customers
                          are expected to review information on the website
                          before placing orders.
                        </li>
                      </ul>

                      <h2>5. Customer Responsibility</h2>
                      <ul>
                        <li>
                          <strong>
                            5.1 Device Compatibility and Condition:
                          </strong>{" "}
                          Customers must ensure router compatibility and
                          condition before service.
                        </li>
                      </ul>

                      <h2>6. Service Delivery Times</h2>
                      <ul>
                        <li>
                          <strong>6.1 Quoted Times:</strong> Prices and delivery
                          times are as quoted, subject to provider updates.
                        </li>
                        <li>
                          <strong>6.2 Unforeseen Delays:</strong> Times may
                          change without notice; updates will be provided.
                        </li>
                      </ul>

                      <h2>7. 100% Money Back Guarantee / Refund Policy</h2>
                      <ul>
                        <li>
                          <strong>7.1 Exclusions:</strong> No guarantee for
                          blacklisted or blocked routers.
                        </li>
                        <li>
                          <strong>7.2 Applicability:</strong> Refund only if
                          unlock returns 'unavailable'.
                        </li>
                        <li>
                          <strong>7.3 Non-Refundable:</strong> Eligibility
                          checks are non-refundable.
                        </li>
                        <li>
                          <strong>7.4 Router Code Prompt:</strong> Device must
                          prompt for code or costs are non-refundable.
                        </li>
                        <li>
                          <strong>7.5 Hard-Locked Routers:</strong> Credit note
                          issued for hard-locked devices.
                        </li>
                        <li>
                          <strong>7.6 No Code Prompt:</strong> Credit note
                          issued if no prompt is present.
                        </li>
                        <li>
                          <strong>7.7 Technician Failures:</strong> Refund if
                          technician fails, but no refund for blacklisted
                          devices after successful unlock.
                        </li>
                        <li>
                          <strong>7.8 Standard Failures:</strong> Credit note
                          issued if not upgraded to Premium.
                        </li>
                        <li>
                          <strong>7.9 Premium Failures:</strong> Full refund
                          issued.
                        </li>
                      </ul>

                      <h2>8. Unlocking Instructions</h2>
                      <ul>
                        <li>
                          <strong>8.1 Completion Notification:</strong>{" "}
                          Instructions sent via email after completion.
                        </li>
                        <li>
                          <strong>8.2 Instruction Types:</strong> May include
                          code entry or network reset instructions.
                        </li>
                      </ul>

                      <h2>9. Customer Error</h2>
                      <ul>
                        <li>
                          <strong>9.1 Fulfilled Orders:</strong> No refunds for
                          customer data errors on fulfilled orders.
                        </li>
                        <li>
                          <strong>9.2 Unfulfilled Orders:</strong> Attempt to
                          correct details; if not possible, new order required.
                        </li>
                      </ul>

                      <h2>10. 'Unavailable' Unlock</h2>
                      <ul>
                        <li>
                          <strong>10.1 Status Meaning:</strong> Requires further
                          investigation.
                        </li>
                      </ul>

                      <h2>11. Backup of Important Data</h2>
                      <ul>
                        <li>
                          <strong>11.1 Router Modifications:</strong> Restore
                          factory settings if modified.
                        </li>
                        <li>
                          <strong>11.2 Data Loss Disclaimer:</strong> Backup is
                          customer's responsibility.
                        </li>
                      </ul>

                      <h2>12. Privacy Statement</h2>
                      <ul>
                        <li>
                          <strong>12.1 Data Security:</strong> Secure storage of
                          personal data.
                        </li>
                        <li>
                          <strong>12.2 Data Usage:</strong> Used only for
                          processing orders.
                        </li>
                        <li>
                          <strong>12.3 Third-Party Sharing:</strong> No sharing
                          without consent.
                        </li>
                        <li>
                          <strong>12.4 Payment Card Security:</strong> Card data
                          not stored.
                        </li>
                        <li>
                          <strong>12.5 Data Removal Request:</strong> Customers
                          may request data deletion.
                        </li>
                        <li>
                          <strong>12.6 Review Usage:</strong> Reviews may be
                          displayed on our site.
                        </li>
                      </ul>

                      <h2>13. Fraud & Deception</h2>
                      <ul>
                        <li>
                          <strong>13.1 Zero Tolerance:</strong> Fraud will be
                          reported.
                        </li>
                        <li>
                          <strong>13.2 IP Logging:</strong> IP addresses logged
                          throughout process.
                        </li>
                        <li>
                          <strong>13.3 Fraudulent Attempts:</strong> Debt
                          recovery initiated for fraud.
                        </li>
                        <li>
                          <strong>13.4 Invoice & Penalties:</strong> £100 fee
                          plus monthly charges and interest if unpaid.
                        </li>
                        <li>
                          <strong>13.5 UK Disputes:</strong> £350 fee if taken
                          to Small Claims Court.
                        </li>
                        <li>
                          <strong>13.6 US Disputes:</strong> $350 Small Claims
                          fee.
                        </li>
                        <li>
                          <strong>13.7 Stolen Cards:</strong> Suspected devices
                          will be blacklisted.
                        </li>
                      </ul>

                      <h2>14. Termination of Orders</h2>
                      <ul>
                        <li>
                          <strong>14.1 Abusive Behavior:</strong> Orders may be
                          terminated with no refund.
                        </li>
                      </ul>

                      <h2>15. Barred Routers</h2>
                      <ul>
                        <li>
                          <strong>15.1 Blacklist Impact:</strong> No refund if
                          found blacklisted after successful unlock.
                        </li>
                      </ul>

                      <h2>16. Disclaimer</h2>
                      <ul>
                        <li>
                          <strong>16.1 Third-Party Trademarks:</strong> All
                          logos and trademarks are owned by respective parties.
                        </li>
                        <li>
                          <strong>16.2 Data Loss Responsibility:</strong> Not
                          responsible for any data loss.
                        </li>
                        <li>
                          <strong>16.3 Price Matching:</strong> Applies to UK
                          VAT-registered companies only, excludes network
                          providers.
                        </li>
                      </ul>

                      <p>
                        <strong>Note:</strong> These conditions are in addition
                        to your statutory rights, which remain unaffected.
                      </p>
                      <p>
                        <strong>
                          ALL PURCHASES ARE SUBJECT TO THESE TERMS & CONDITIONS
                          AND COMPLY FULLY WITH CONSUMER LAW.
                        </strong>
                      </p>
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
