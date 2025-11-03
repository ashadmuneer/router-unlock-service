import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import UnlockSection from "../Component/MainPage/UnlockSection";
import Blogcard from "../Component/Youtubecard/Youtubecard";
import Faq from "../Component/FAQ/Faq";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash?.substring(1); // removes the "#"
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // Give the DOM time to render
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <title>GenuineUnlocker | Modem & Router Unlock Code Service</title>
        <meta
          name="description"
          content="Unlock your routers, modems, and MiFi devices instantly for use with any SIM or mobile network worldwide. Whether you're using a Huawei modem, ZTE router, STC 5G device, Zain MiFi, Go Telecom unit, or any other brand, GenuineUnlocker provides fast, secure, and permanent unlock codes delivered online.

No technical skills needed — just enter your device’s IMEI or serial number and receive your unique unlock code via email or SMS. Our unlocking service supports 4G and 5G routers, including popular models from Huawei, ZTE, Oppo, Greenpacket, Brovi, Soyealink, and GHTelcom.

Bypass SIM restrictions, switch carriers freely, and enjoy true network freedom — anytime, anywhere. Trusted by thousands globally, we provide 24/7 support and 100% satisfaction guarantee.

Supported networks: STC, Zain, Go Telecom, Mobily, Etisalat, and more.
Unlock your modem now and use it with any SIM worldwide."
        />
      </Helmet>
      <div id="home">
        <UnlockSection />
      </div>
      <div id="howtounlock">
        <Blogcard />
      </div>

      <div id="faq">
        <Faq />
      </div>
    </>
  );
};

export default Home;
