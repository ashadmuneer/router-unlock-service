import { Routes, Route } from 'react-router-dom';
import NavBar from './Component/NavBar/NavBar';
import Footer from './Component/Footer/Footer';
import Home from './Pages/Home';
import './App.css';
import BlogDetailPage from './Component/Blogdetailpage/BlogDetailPage';
import OrderTracking from './Component/OrderTracking/OrderTracking';
import Order from './Component/Order/Order';
import TermsAndConditions from './Component/Termandconditions/TermsAndConditions';
import About from './Component/AboutUs/About';
import HowToUseCodePage from './Component/UnlockCode/HowToUseCode'
import ScrollToTop from './Component/ScrollToTop';

const App = () => {
  return (
    <>
      <NavBar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/order/:orderId" element={<Order />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/track-order" element={<OrderTracking />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/how-to-use-code" element={<HowToUseCodePage />} />

        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
