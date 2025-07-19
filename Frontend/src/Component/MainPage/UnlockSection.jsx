import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UnlockSection.css";
import BrandLogo from "../../assets/Brandlogo.png";
import { Helmet } from 'react-helmet-async';


const routerData = {
  networks: ["STC", "ZAIN", "MOBILY", "GO Telecom", "Other"],
};

const tacRouterDB = {
  "86720604": { brand: "HUAWEI", model: "H112-370" },
  "86073004": { brand: "HUAWEI", model: "H112-372" },
  "86193505": { brand: "HUAWEI", model: "H122-373A" },
  "86688704": { brand: "HUAWEI", model: "H122-373" },
  "86406705": { brand: "HUAWEI", model: "N5368X" },
  "86597804": { brand: "HUAWEI", model: "E6878-370" },
  "86037604": { brand: "HUAWEI", model: "E6878-870" },
  "86584007": { brand: "Brovi", model: "H153-381" },
  "86124107": { brand: "Brovi", model: "H151-370" },
  "86075606": { brand: "Brovi", model: "H155-381" },
  "86681507": { brand: "Brovi", model: "H155-381" },
  "86688806": { brand: "Brovi", model: "H155-382" },
  "86241607": { brand: "Brovi", model: "H155-383" },
  "86717306": { brand: "Brovi", model: "H158-381" },
  "86120006": { brand: "Brovi", model: "H352-381" },
  "86968607": { brand: "Brovi", model: "E6888-982" },
  "86119206": { brand: "Brovi Plus", model: "H155-380" },
  "86015506": { brand: "ZTE", model: "MU5120" },
  "86581106": { brand: "ZTE", model: "MC888" },
  "86367104": { brand: "ZTE", model: "MC801A" },
  "86556005": { brand: "ZTE", model: "MC801A" },
  "86896605": { brand: "ZTE", model: "MC801A" },
  "86156906": { brand: "ZTE", model: "MC888A ULTRA" },
  "86992605": { brand: "ZTE", model: "MU5001M" },
  "86637807": { brand: "ZTE", model: "G5C" },
  "86062806": { brand: "ZTE", model: "MC801A1" },
  "86160006": { brand: "ZTE", model: "MC801A1" },
  "86583105": { brand: "Oppo", model: "T1A (CTC03)" },
  "86264406": { brand: "Oppo", model: "T1A (CTC03)" },
  "86782206": { brand: "Oppo", model: "T2 (CTD05)" },
  "86481205": { brand: "GHTelcom", model: "H138-380" },
  "86588106": { brand: "Soyealink", model: "SRT873" },
  "86399806": { brand: "Soyealink", model: "SRT875" },
  "35840799": { brand: "GreenPacket", model: "D5H-250MK" },
  "35162435": { brand: "GreenPacket", model: "D5H-EA20" },
  "35759615": { brand: "GreenPacket", model: "Y5-210MU" },
  "35181075": { brand: "AVXAV", model: "WQRTM-838A" },
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
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  useEffect(() => {
    if (countryCode && phoneNumber) {
      setMobileNumber(countryCode + phoneNumber);
    } else {
      setMobileNumber(""); // Clear mobileNumber if no country code is selected
    }
  }, [countryCode, phoneNumber]);

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
    <>
    
    <Helmet>
        <meta
          name="description"
          content="Unlock your routers, modems, and MiFi devices instantly for use with any SIM or mobile network worldwide. Whether you're using a Huawei modem, ZTE router, STC 5G device, Zain MiFi, Go Telecom unit, or any other brand, GenuineUnlocker provides fast, secure, and permanent unlock codes delivered online.

No technical skills needed — just enter your device’s IMEI or serial number and receive your unique unlock code via email or SMS. Our unlocking service supports 4G and 5G routers, including popular models from Huawei, ZTE, Oppo, Greenpacket, Brovi, Soyealink, and GHTelcom.

Bypass SIM restrictions, switch carriers freely, and enjoy true network freedom — anytime, anywhere. Trusted by thousands globally, we provide 24/7 support and 100% satisfaction guarantee.

Supported networks: STC, Zain, Go Telecom, Mobily, Etisalat, and more.
Unlock your modem now and use it with any SIM worldwide."
        />
        <link rel="canonical" href="https://genuineunlocker.net/#home" />
      </Helmet>
    <section className="unlock-section">
      <h1>
        <span className="highlight">Unlock your Wifi router</span> today with{" "}
        <span className="highlight">Genuine Unlocker</span>
      </h1>
      <h2>
        Unlocking <span className="via">via IMEI</span>
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
                <option value="">Select Network</option>
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
                {loading ? "Processing..." : "Buy Router Unlock Code"}
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
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="country-code-select"
                >
                  <option value="">Country Code</option>
                  <option value="+966">🇸🇦 +966 (KSA)</option>
                  <option value="+91">🇮🇳 +91 (India)</option>
                  <option value="+971">🇦🇪 +971 (United Arab Emirates)</option>
                  <option value="+44">🇬🇧 +44 (United Kingdom)</option>
                  <option value="+1">🇺🇸 +1 (United States)</option>
                  <option value="+93">🇦🇫 +93 (Afghanistan)</option>
                  <option value="+355">🇦🇱 +355 (Albania)</option>
                  <option value="+213">🇩🇿 +213 (Algeria)</option>
                  <option value="+376">🇦🇩 +376 (Andorra)</option>
                  <option value="+244">🇦🇴 +244 (Angola)</option>
                  <option value="+1264">🇦🇮 +1264 (Anguilla)</option>
                  <option value="+672">🇦🇶 +672 (Antarctica)</option>
                  <option value="+1268">🇦🇬 +1268 (Antigua and Barbuda)</option>
                  <option value="+54">🇦🇷 +54 (Argentina)</option>
                  <option value="+374">🇦🇲 +374 (Armenia)</option>
                  <option value="+297">🇦🇼 +297 (Aruba)</option>
                  <option value="+61">🇦🇺 +61 (Australia)</option>
                  <option value="+43">🇦🇹 +43 (Austria)</option>
                  <option value="+994">🇦🇿 +994 (Azerbaijan)</option>
                  <option value="+1242">🇧🇸 +1242 (Bahamas)</option>
                  <option value="+973">🇧🇭 +973 (Bahrain)</option>
                  <option value="+880">🇧🇩 +880 (Bangladesh)</option>
                  <option value="+1246">🇧🇧 +1246 (Barbados)</option>
                  <option value="+375">🇧🇾 +375 (Belarus)</option>
                  <option value="+32">🇧🇪 +32 (Belgium)</option>
                  <option value="+501">🇧🇿 +501 (Belize)</option>
                  <option value="+229">🇧🇯 +229 (Benin)</option>
                  <option value="+1441">🇧🇲 +1441 (Bermuda)</option>
                  <option value="+975">🇧🇹 +975 (Bhutan)</option>
                  <option value="+591">🇧🇴 +591 (Bolivia)</option>
                  <option value="+387">🇧🇦 +387 (Bosnia and Herzegovina)</option>
                  <option value="+267">🇧🇼 +267 (Botswana)</option>
                  <option value="+55">🇧🇷 +55 (Brazil)</option>
                  <option value="+246">
                    🇮🇴 +246 (British Indian Ocean Territory)
                  </option>
                  <option value="+1284">
                    🇻🇬 +1284 (British Virgin Islands)
                  </option>
                  <option value="+673">🇧🇳 +673 (Brunei)</option>
                  <option value="+359">🇧🇬 +359 (Bulgaria)</option>
                  <option value="+226">🇧🇫 +226 (Burkina Faso)</option>
                  <option value="+257">🇧🇮 +257 (Burundi)</option>
                  <option value="+855">🇰🇭 +855 (Cambodia)</option>
                  <option value="+237">🇨🇲 +237 (Cameroon)</option>
                  <option value="+1">🇨🇦 +1 (Canada)</option>
                  <option value="+238">🇨🇻 +238 (Cape Verde)</option>
                  <option value="+1345">🇰🇾 +1345 (Cayman Islands)</option>
                  <option value="+236">
                    🇨🇫 +236 (Central African Republic)
                  </option>
                  <option value="+235">🇹🇩 +235 (Chad)</option>
                  <option value="+56">🇨🇱 +56 (Chile)</option>
                  <option value="+86">🇨🇳 +86 (China)</option>
                  <option value="+57">🇨🇴 +57 (Colombia)</option>
                  <option value="+269">🇰🇲 +269 (Comoros)</option>
                  <option value="+242">🇨🇬 +242 (Congo)</option>
                  <option value="+243">
                    🇨🇩 +243 (Congo, Democratic Republic)
                  </option>
                  <option value="+682">🇨🇰 +682 (Cook Islands)</option>
                  <option value="+506">🇨🇷 +506 (Costa Rica)</option>
                  <option value="+385">🇭🇷 +385 (Croatia)</option>
                  <option value="+53">🇨🇺 +53 (Cuba)</option>
                  <option value="+599">🇨🇼 +599 (Curaçao)</option>
                  <option value="+357">🇨🇾 +357 (Cyprus)</option>
                  <option value="+420">🇨🇿 +420 (Czech Republic)</option>
                  <option value="+45">🇩🇰 +45 (Denmark)</option>
                  <option value="+253">🇩🇯 +253 (Djibouti)</option>
                  <option value="+1767">🇩🇲 +1767 (Dominica)</option>
                  <option value="+1809">🇩🇴 +1809 (Dominican Republic)</option>
                  <option value="+593">🇪🇨 +593 (Ecuador)</option>
                  <option value="+20">🇪🇬 +20 (Egypt)</option>
                  <option value="+503">🇸🇻 +503 (El Salvador)</option>
                  <option value="+240">🇬🇶 +240 (Equatorial Guinea)</option>
                  <option value="+291">🇪🇷 +291 (Eritrea)</option>
                  <option value="+372">🇪🇪 +372 (Estonia)</option>
                  <option value="+251">🇪🇹 +251 (Ethiopia)</option>
                  <option value="+500">🇫🇰 +500 (Falkland Islands)</option>
                  <option value="+298">🇫🇴 +298 (Faroe Islands)</option>
                  <option value="+679">🇫🇯 +679 (Fiji)</option>
                  <option value="+358">🇫🇮 +358 (Finland)</option>
                  <option value="+33">🇫🇷 +33 (France)</option>
                  <option value="+594">🇬🇫 +594 (French Guiana)</option>
                  <option value="+689">🇵🇫 +689 (French Polynesia)</option>
                  <option value="+241">🇬🇦 +241 (Gabon)</option>
                  <option value="+220">🇬🇲 +220 (Gambia)</option>
                  <option value="+995">🇬🇪 +995 (Georgia)</option>
                  <option value="+49">🇩🇪 +49 (Germany)</option>
                  <option value="+233">🇬🇭 +233 (Ghana)</option>
                  <option value="+350">🇬🇮 +350 (Gibraltar)</option>
                  <option value="+30">🇬🇷 +30 (Greece)</option>
                  <option value="+299">🇬🇱 +299 (Greenland)</option>
                  <option value="+1473">🇬🇩 +1473 (Grenada)</option>
                  <option value="+590">🇬🇵 +590 (Guadeloupe)</option>
                  <option value="+1671">🇬🇺 +1671 (Guam)</option>
                  <option value="+502">🇬🇹 +502 (Guatemala)</option>
                  <option value="+44">🇬🇬 +44 (Guernsey)</option>
                  <option value="+224">🇬🇳 +224 (Guinea)</option>
                  <option value="+245">🇬🇼 +245 (Guinea-Bissau)</option>
                  <option value="+592">🇬🇾 +592 (Guyana)</option>
                  <option value="+509">🇭🇹 +509 (Haiti)</option>
                  <option value="+504">🇭🇳 +504 (Honduras)</option>
                  <option value="+852">🇭🇰 +852 (Hong Kong)</option>
                  <option value="+36">🇭🇺 +36 (Hungary)</option>
                  <option value="+354">🇮🇸 +354 (Iceland)</option>
                  <option value="+62">🇮🇩 +62 (Indonesia)</option>
                  <option value="+98">🇮🇷 +98 (Iran)</option>
                  <option value="+964">🇮🇶 +964 (Iraq)</option>
                  <option value="+353">🇮🇪 +353 (Ireland)</option>
                  <option value="+44">🇮🇲 +44 (Isle of Man)</option>
                  <option value="+972">🇮🇱 +972 (Israel)</option>
                  <option value="+39">🇮🇹 +39 (Italy)</option>
                  <option value="+1876">🇯🇲 +1876 (Jamaica)</option>
                  <option value="+81">🇯🇵 +81 (Japan)</option>
                  <option value="+44">🇯🇪 +44 (Jersey)</option>
                  <option value="+962">🇯🇴 +962 (Jordan)</option>
                  <option value="+7">🇰🇿 +7 (Kazakhstan)</option>
                  <option value="+254">🇰🇪 +254 (Kenya)</option>
                  <option value="+686">🇰🇮 +686 (Kiribati)</option>
                  <option value="+383">🇽🇰 +383 (Kosovo)</option>
                  <option value="+965">🇰🇼 +965 (Kuwait)</option>
                  <option value="+996">🇰🇬 +996 (Kyrgyzstan)</option>
                  <option value="+856">🇱🇦 +856 (Laos)</option>
                  <option value="+371">🇱🇻 +371 (Latvia)</option>
                  <option value="+961">🇱🇧 +961 (Lebanon)</option>
                  <option value="+266">🇱🇸 +266 (Lesotho)</option>
                  <option value="+231">🇱🇷 +231 (Liberia)</option>
                  <option value="+218">🇱🇾 +218 (Libya)</option>
                  <option value="+423">🇱🇮 +423 (Liechtenstein)</option>
                  <option value="+370">🇱🇹 +370 (Lithuania)</option>
                  <option value="+352">🇱🇺 +352 (Luxembourg)</option>
                  <option value="+853">🇲🇴 +853 (Macau)</option>
                  <option value="+389">🇲🇰 +389 (North Macedonia)</option>
                  <option value="+261">🇲🇬 +261 (Madagascar)</option>
                  <option value="+265">🇲🇼 +265 (Malawi)</option>
                  <option value="+60">🇲🇾 +60 (Malaysia)</option>
                  <option value="+960">🇲🇻 +960 (Maldives)</option>
                  <option value="+223">🇲🇱 +223 (Mali)</option>
                  <option value="+356">🇲🇹 +356 (Malta)</option>
                  <option value="+692">🇲🇭 +692 (Marshall Islands)</option>
                  <option value="+596">🇲🇶 +596 (Martinique)</option>
                  <option value="+222">🇲🇷 +222 (Mauritania)</option>
                  <option value="+230">🇲🇺 +230 (Mauritius)</option>
                  <option value="+262">🇾🇹 +262 (Mayotte)</option>
                  <option value="+52">🇲🇽 +52 (Mexico)</option>
                  <option value="+691">🇫🇲 +691 (Micronesia)</option>
                  <option value="+373">🇲🇩 +373 (Moldova)</option>
                  <option value="+377">🇲🇨 +377 (Monaco)</option>
                  <option value="+976">🇲🇳 +976 (Mongolia)</option>
                  <option value="+382">🇲🇪 +382 (Montenegro)</option>
                  <option value="+1664">🇲🇸 +1664 (Montserrat)</option>
                  <option value="+212">🇲🇦 +212 (Morocco)</option>
                  <option value="+258">🇲🇿 +258 (Mozambique)</option>
                  <option value="+95">🇲🇲 +95 (Myanmar)</option>
                  <option value="+264">🇳🇦 +264 (Namibia)</option>
                  <option value="+674">🇳🇷 +674 (Nauru)</option>
                  <option value="+977">🇳🇵 +977 (Nepal)</option>
                  <option value="+31">🇳🇱 +31 (Netherlands)</option>
                  <option value="+687">🇳🇨 +687 (New Caledonia)</option>
                  <option value="+64">🇳🇿 +64 (New Zealand)</option>
                  <option value="+505">🇳🇮 +505 (Nicaragua)</option>
                  <option value="+227">🇳🇪 +227 (Niger)</option>
                  <option value="+234">🇳🇬 +234 (Nigeria)</option>
                  <option value="+683">🇳🇺 +683 (Niue)</option>
                  <option value="+672">🇳🇫 +672 (Norfolk Island)</option>
                  <option value="+850">🇰🇵 +850 (North Korea)</option>
                  <option value="+1670">
                    🇲🇵 +1670 (Northern Mariana Islands)
                  </option>
                  <option value="+47">🇳🇴 +47 (Norway)</option>
                  <option value="+968">🇴🇲 +968 (Oman)</option>
                  <option value="+92">🇵🇰 +92 (Pakistan)</option>
                  <option value="+680">🇵🇼 +680 (Palau)</option>
                  <option value="+970">🇵🇸 +970 (Palestine)</option>
                  <option value="+507">🇵🇦 +507 (Panama)</option>
                  <option value="+675">🇵🇬 +675 (Papua New Guinea)</option>
                  <option value="+595">🇵🇾 +595 (Paraguay)</option>
                  <option value="+51">🇵🇪 +51 (Peru)</option>
                  <option value="+63">🇵🇭 +63 (Philippines)</option>
                  <option value="+48">🇵🇱 +48 (Poland)</option>
                  <option value="+351">🇵🇹 +351 (Portugal)</option>
                  <option value="+1787">🇵🇷 +1787 (Puerto Rico)</option>
                  <option value="+974">🇶🇦 +974 (Qatar)</option>
                  <option value="+262">🇷🇪 +262 (Réunion)</option>
                  <option value="+40">🇷🇴 +40 (Romania)</option>
                  <option value="+7">🇷🇺 +7 (Russia)</option>
                  <option value="+250">🇷🇼 +250 (Rwanda)</option>
                  <option value="+590">🇧🇱 +590 (Saint Barthélemy)</option>
                  <option value="+290">🇸🇭 +290 (Saint Helena)</option>
                  <option value="+1869">
                    🇰🇳 +1869 (Saint Kitts and Nevis)
                  </option>
                  <option value="+1758">🇱🇨 +1758 (Saint Lucia)</option>
                  <option value="+590">🇲🇫 +590 (Saint Martin)</option>
                  <option value="+508">
                    🇵🇲 +508 (Saint Pierre and Miquelon)
                  </option>
                  <option value="+1784">
                    🇻🇨 +1784 (Saint Vincent and the Grenadines)
                  </option>
                  <option value="+685">🇼🇸 +685 (Samoa)</option>
                  <option value="+378">🇸🇲 +378 (San Marino)</option>
                  <option value="+239">🇸🇹 +239 (São Tomé and Príncipe)</option>
                  <option value="+966">🇸🇦 +966 (Saudi Arabia)</option>
                  <option value="+221">🇸🇳 +221 (Senegal)</option>
                  <option value="+381">🇷🇸 +381 (Serbia)</option>
                  <option value="+248">🇸🇨 +248 (Seychelles)</option>
                  <option value="+232">🇸🇱 +232 (Sierra Leone)</option>
                  <option value="+65">🇸🇬 +65 (Singapore)</option>
                  <option value="+421">🇸🇰 +421 (Slovakia)</option>
                  <option value="+386">🇸🇮 +386 (Slovenia)</option>
                  <option value="+677">🇸🇧 +677 (Solomon Islands)</option>
                  <option value="+252">🇸🇴 +252 (Somalia)</option>
                  <option value="+27">🇿🇦 +27 (South Africa)</option>
                  <option value="+82">🇰🇷 +82 (South Korea)</option>
                  <option value="+211">🇸🇸 +211 (South Sudan)</option>
                  <option value="+34">🇪🇸 +34 (Spain)</option>
                  <option value="+94">🇱🇰 +94 (Sri Lanka)</option>
                  <option value="+249">🇸🇩 +249 (Sudan)</option>
                  <option value="+597">🇸🇷 +597 (Suriname)</option>
                  <option value="+268">🇸🇿 +268 (Eswatini)</option>
                  <option value="+46">🇸🇪 +46 (Sweden)</option>
                  <option value="+41">🇨🇭 +41 (Switzerland)</option>
                  <option value="+963">🇸🇾 +963 (Syria)</option>
                  <option value="+886">🇹🇼 +886 (Taiwan)</option>
                  <option value="+992">🇹🇯 +992 (Tajikistan)</option>
                  <option value="+255">🇹🇿 +255 (Tanzania)</option>
                  <option value="+66">🇹🇭 +66 (Thailand)</option>
                  <option value="+670">🇹🇱 +670 (Timor-Leste)</option>
                  <option value="+228">🇹🇬 +228 (Togo)</option>
                  <option value="+690">🇹🇰 +690 (Tokelau)</option>
                  <option value="+676">🇹🇴 +676 (Tonga)</option>
                  <option value="+1868">🇹🇹 +1868 (Trinidad and Tobago)</option>
                  <option value="+216">🇹🇳 +216 (Tunisia)</option>
                  <option value="+90">🇹🇷 +90 (Turkey)</option>
                  <option value="+993">🇹🇲 +993 (Turkmenistan)</option>
                  <option value="+1649">
                    🇹🇨 +1649 (Turks and Caicos Islands)
                  </option>
                  <option value="+688">🇹🇻 +688 (Tuvalu)</option>
                  <option value="+256">🇺🇬 +256 (Uganda)</option>
                  <option value="+380">🇺🇦 +380 (Ukraine)</option>
                  <option value="+1340">🇻🇮 +1340 (U.S. Virgin Islands)</option>
                  <option value="+598">🇺🇾 +598 (Uruguay)</option>
                  <option value="+998">🇺🇿 +998 (Uzbekistan)</option>
                  <option value="+678">🇻🇺 +678 (Vanuatu)</option>
                  <option value="+58">🇻🇪 +58 (Venezuela)</option>
                  <option value="+84">🇻🇳 +84 (Vietnam)</option>
                  <option value="+681">🇼🇫 +681 (Wallis and Futuna)</option>
                  <option value="+967">🇾🇪 +967 (Yemen)</option>
                  <option value="+260">🇿🇲 +260 (Zambia)</option>
                  <option value="+263">🇿🇼 +263 (Zimbabwe)</option>
                </select>
                <input
                  type="tel"
                  id="mobileNumber"
                  placeholder="Enter number"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  className="phone-number-input"
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
                    Terms and Conditions{" "}
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
                      <h1>Terms and Conditions</h1>

                      <p>
                        Please read these Terms and Conditions carefully before
                        using{" "}
                        <a href="https://genuineunlocker.net">
                          https://genuineunlocker.net
                        </a>{" "}
                        or any of our services. Your access to and use of the
                        service is conditioned upon your acceptance and
                        compliance with these Terms.
                      </p>
                      <p>
                        By accessing or using the Service, you agree to be bound
                        by these Terms. If you disagree with any part of the
                        Terms, you should not access the Service.
                      </p>
                      <p>
                        Your purchase will appear on your card statements as{" "}
                        <strong>GENUINEUNLOCKER</strong>. Goods are sold in USD.
                      </p>

                      <section>
                        <h2>1. Description of Service</h2>
                        <p>
                          1.1 <strong>GenuineUnlocker.net</strong> provides
                          professional WiFi router unlocking services using a
                          16-digit unlock code to remove network restrictions,
                          allowing your router to work with any compatible SIM
                          card or network provider. The service begins upon
                          receipt of payment.
                        </p>
                        <p>
                          1.2 Delivery times are guidelines provided by network
                          providers and may vary without notice.
                        </p>
                      </section>

                      <section>
                        <h2>2. Cancellation</h2>
                        <p>
                          2.1 Orders cannot be canceled once payment is made, as
                          unlocking costs are incurred immediately. By selecting
                          Credit/Debit Payment, you authorize the order to
                          commence immediately.
                        </p>
                      </section>

                      <section>
                        <h2>3. Legality of Service</h2>
                        <p>
                          3.1 All services are legal in Europe and North
                          America. If ordering from outside these regions, you
                          are responsible for verifying compliance with local
                          laws before placing an order. You are solely
                          responsible for any legal problems arising from the
                          use of our service.
                        </p>
                      </section>

                      <section>
                        <h2>4. Customer Responsibility</h2>
                        <p>4.1 You are responsible for:</p>
                        <ul>
                          <li>
                            Reviewing all information on the website prior to
                            ordering.
                          </li>
                          <li>
                            Verifying your router’s compatibility with the
                            intended network post-unlock.
                          </li>
                          <li>
                            Ensuring the router is in good working condition.
                          </li>
                          <li>
                            Providing accurate router details (e.g., IMEI,
                            model, current network).
                          </li>
                        </ul>
                        <p>
                          4.2 For routers requiring an unlock code, you must
                          confirm the device prompts for a code when an
                          incompatible SIM is inserted.
                        </p>
                      </section>

                      <section>
                        <h2>5. Service Delivery Times</h2>
                        <p>
                          5.1 Prices and delivery times are as quoted on the
                          website. Delivery times are subject to change based on
                          network provider processes.
                        </p>
                      </section>

                      <section>
                        <h2>6. 100% Money Back Guarantee / Refund Policy</h2>
                        <p>
                          6.1 All services are covered by our 100% Money Back
                          Guarantee, subject to the following conditions:
                        </p>
                        <ul>
                          <li>
                            No refund is provided if the router is blacklisted,
                            reported lost, stolen, or blocked by the
                            manufacturer or network.
                          </li>
                          <li>
                            Refund is granted only if our unlock attempt returns
                            an 'incorrect code' status.
                          </li>
                          <li>
                            If the router does not prompt for an unlock code (as
                            required), submission costs are non-refundable.
                          </li>
                          <li>
                            If an incorrect unlock code is entered or if the
                            technical team determines a wrong code was used, no
                            refund is given.
                          </li>
                          <li>
                            If the unlock attempt count is zero (not attempted),
                            the order is non-refundable.
                          </li>
                          <li>
                            In cases of modified unlock errors, no refund will
                            be provided.
                          </li>
                          <li>
                            If the unlock succeeds but the router is later
                            blacklisted, no refund is issued.
                          </li>
                          <li>
                            Refunds are only provided to the same account or
                            payment number used during the original transaction.
                          </li>
                        </ul>
                      </section>

                      <section>
                        <h2>7. Customer Error</h2>
                        <p>
                          7.1 No changes or refunds are available for fulfilled
                          orders where incorrect router details (e.g., IMEI,
                          model, network) are provided.
                        </p>
                      </section>

                      <section>
                        <h2>8. Restrictions</h2>
                        <p>
                          By using this website, you agree to the following
                          rules:
                        </p>
                        <ul>
                          <li>
                            You must be at least 18 years old to use this
                            website or place an order.
                          </li>
                          <li>
                            Do not use a fake name or email address when
                            contacting us or placing an order.
                          </li>
                          <li>
                            Do not copy, sell, or share any part of this website
                            for personal or business use.
                          </li>
                          <li>
                            Do not use this website in a way that causes
                            problems for others or breaks the law.
                          </li>
                          <li>
                            Do not try to collect data from the website using
                            bots or software tools.
                          </li>
                          <li>
                            Do not use this website to send spam or unauthorized
                            ads.
                          </li>
                        </ul>
                      </section>

                      <section>
                        <h2>9. Links to External Sites</h2>
                        <p>
                          9.1 Our website may contain links to third-party
                          websites or services not owned or controlled by
                          GenuineUnlocker.
                        </p>
                        <p>
                          9.2 We assume no responsibility for the content,
                          privacy policies, or practices of third-party
                          websites.
                        </p>
                      </section>

                      <section>
                        <h2>10. Limitation of Liability</h2>
                        <p>
                          10.1 GenuineUnlocker provides all information in good
                          faith but does not guarantee its accuracy or
                          completeness.
                        </p>
                        <p>
                          10.2 We are not responsible for any loss or damage
                          resulting from your use of the service, including
                          device or data issues.
                        </p>
                      </section>

                      <section>
                        <h2>11. Indemnification</h2>
                        <p>
                          11.1 You agree to indemnify GenuineUnlocker against
                          any claims or damages resulting from your breach of
                          these Terms.
                        </p>
                      </section>

                      <section>
                        <h2>12. Severability</h2>
                        <p>
                          12.1 If any part of these Terms is found invalid, the
                          rest will remain in full effect.
                        </p>
                      </section>

                      <section>
                        <h2>13. Variation of Terms</h2>
                        <p>
                          13.1 We may update or change these Terms at any time.
                          If there are important changes, we will try to inform
                          you in advance whenever possible.
                        </p>
                      </section>

                      <section>
                        <h2>14. Assignment</h2>
                        <p>
                          14.1 GenuineUnlocker may transfer its rights or
                          obligations without notice. You may not transfer yours
                          without our consent.
                        </p>
                      </section>

                      <section>
                        <h2>15. Barred Routers (Lost, Stolen, Blacklisted)</h2>
                        <p>
                          15.1 If your router is later found blacklisted, no
                          refund will be provided—even if the unlock process has
                          succeeded.
                        </p>
                      </section>

                      <section>
                        <h2>16. Privacy</h2>
                        <p>
                          16.1 We do not store your card details. Your data is
                          kept secure and used only to process your order.
                        </p>
                      </section>

                      <section>
                        <h2>17. Termination of Orders</h2>
                        <p>
                          17.1 We may terminate orders if users are abusive or
                          aggressive. Refunds will not be issued in such cases.
                        </p>
                      </section>

                      <section>
                        <h2>18. Entire Agreement</h2>
                        <p>
                          18.1 These Terms represent the entire agreement
                          between you and GenuineUnlocker.
                        </p>
                      </section>

                      <section>
                        <h2>19. Contact Us</h2>
                        <p>
                          For questions, email us at{" "}
                          <a href="mailto:genuineunlockerinfo@gmail.com">
                            genuineunlockerinfo@gmail.com
                          </a>
                          .
                        </p>
                      </section>
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
                disabled={loading}
                style={loading ? { opacity: 0.6, cursor: "not-allowed" } : {}}
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
    </>
  );
};

export default UnlockSection;
