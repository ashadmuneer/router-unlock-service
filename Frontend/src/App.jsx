import React, { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "./Component/loader/Loader.jsx"; // ✅ custom loader
import AllDevices from "./Component/AllDevice/AllDevicePage.jsx";
import YoutubeDetailPage from "./Component/Youtubedetailpage/YoutubeDetailPage.jsx";

// ✅ Lazy load all components
const NavBar = lazy(() => import("./Component/NavBar/NavBar"));
const Footer = lazy(() => import("./Component/Footer/Footer"));
const ScrollToTop = lazy(() => import("./Component/ScrollToTop"));
const Home = lazy(() => import("./Pages/Home"));
const BlogDetailPage = lazy(() => import("./Component/Youtubedetailpage/YoutubeDetailPage.jsx"));
const OrderTracking = lazy(() => import("./Component/OrderTracking/OrderTracking"));
const Order = lazy(() => import("./Component/Order/Order"));
const TermsAndConditions = lazy(() => import("./Component/Termandconditions/TermsAndConditions"));
const About = lazy(() => import("./Component/AboutUs/About"));
const HowToUseCodePage = lazy(() => import("./Component/UnlockCode/HowToUseCode"));
const DevicePage = lazy(() => import("./Component/AllDevice/DevicePage")); // ✅ dynamic device page

const App = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1600);
    const hideTimer = setTimeout(() => setLoading(false), 2000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (loading) {
    return <Loader fadeOut={fadeOut} />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <NavBar />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/order/:orderId" element={<Order />} />
        <Route path="/Youtube/:title" element={<YoutubeDetailPage />} />
        <Route path="/track-order" element={<OrderTracking />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/how-to-use-code" element={<HowToUseCodePage />} />
        <Route path="/about" element={<About />} />

        {/* ✅ Dynamic Device Page Route */}
        <Route path="/all-devices" element={<AllDevices />} />
        <Route path="/device/:brand/:model" element={<DevicePage />} />


      </Routes>

      <Footer />
    </Suspense>
  );
};

export default App;
