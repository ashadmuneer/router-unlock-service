import React, { useState } from "react";
import "./OrderTracking.css";
import { Helmet } from "react-helmet-async";

const OrderTracking = () => {
  const [imei, setImei] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    setError("");
    setOrderDetails([]);

    // Validate IMEI (15 digits)
    if (!imei) {
      setError("Please enter an IMEI number");
      return;
    }
    if (!/^\d{15}$/.test(imei)) {
      setError("IMEI must be 15 digits");
      return;
    }

    try {
      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }/api/track-order/${imei}`.replace(/\/+$/, ""); // Remove trailing slashes
      const response = await fetch(apiUrl, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();

      // Handle API response format (array or object)
      if (Array.isArray(data)) {
        setOrderDetails(data);
        if (data.length === 0) {
          setError("No orders found for this IMEI");
        }
      } else if (data && typeof data === "object") {
        setOrderDetails([data]); // Wrap single object in array
        if (Object.keys(data).length === 0) {
          setError("No orders found for this IMEI");
        }
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error tracking order:", error.message);
      setError(
        error.message === "Failed to fetch"
          ? "Network error. Please check your connection and try again."
          : error.message
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Track Your Unlock Code Order | GenuineUnlocker</title>
        <meta
          name="description"
          content="Track the status of your unlock code using your email and order ID. Real-time updates and support."
        />
        <link
          rel="canonical"
          href="https://genuineunlocker.net/order-tracking"
        />
      </Helmet>
      <div className="order-tracking-container">
        <h2>Track Your Order</h2>
        <div className="tracking-form">
          <div className="input-group">
            <input
              type="text"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              placeholder="Enter your IMEI Number *"
            />
            <button onClick={handleTrackOrder}>Track Your Order</button>
          </div>
        </div>
        {error && (
          <p className="error-message" style={{ color: "red" }}>
            {error}
          </p>
        )}
        <p className="tracking-info">
          Track the status of your order online with a live progress meter,
          estimated time of delivery, and regular updates if there are any
          unusual delays to your order.
        </p>

        {orderDetails.map((order, index) => (
          <div key={order.orderId} className="order-details">
            <h4>Order #{index + 1}</h4>
            <p>
              <span>Order ID:</span> {order.orderId}
            </p>
            <p>
              <span>Email:</span> {order.email || "Not provided"}
            </p>
            <p>
              <span>Mobile Number:</span> {order.mobileNumber || "Not provided"}
            </p>
            <p>
              <span>IMEI Number:</span> {order.imei}
            </p>
            <p>
              <span>Brand:</span> {order.brand}
            </p>
            <p>
              <span>Model:</span> {order.model}
            </p>
            <p>
              <span>Network:</span> {order.network}
            </p>
            <p>
              <span>Amount:</span> USD {order.amount}
            </p>
            <p>
              <span>Status:</span> {order.paymentStatus || "Pending"}
            </p>
            <p>
              <span>Terms Accepted:</span> {order.termsAccepted ? "Yes" : "No"}
            </p>
            {order.paymentTime && (
              <p>
                <span>Payment Time:</span> {order.paymentTime}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderTracking;
