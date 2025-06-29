import { Routes, Route } from 'react-router-dom';
import NavBar from './Component/NavBar/NavBar';
import Footer from './Component/Footer/Footer';
import Home from './Pages/Home';
import './App.css';
import BlogDetailPage from './Component/Blogdetailpage/BlogDetailPage';
import OrderTracking from './Component/OrderTracking/OrderTracking';
import Order from './Component/Order/Order';

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/order/:orderId" element={<Order />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/track-order" element={<OrderTracking />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
