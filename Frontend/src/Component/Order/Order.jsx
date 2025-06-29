import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Order.css";
import Logo from "../../assets/Genuine Unlocker Logo.png"; // Ensure this path is correct

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Environment variables with fallbacks
  const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://api.example.com").replace(/\/$/, "");
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

  // Simple email validation regex
  const isValidEmail = (email) => {
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    let isMounted = true;

    script.onload = () => {
      if (isMounted) setError("");
    };
    script.onerror = () => {
      if (isMounted) setError("Failed to load payment gateway. Please refresh the page.");
    };

    document.body.appendChild(script);

    return () => {
      isMounted = false;
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Invalid order ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/order-details/${orderId}`, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(10000), // 10s timeout
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error ${response.status}`);
        }
        const data = await response.json();
        if (!data?.orderId) {
          throw new Error("Invalid order data received.");
        }
        // Log the received data to debug email
        console.log("Received order data:", data);
        if (data.email && !isValidEmail(data.email)) {
          console.warn("Invalid email format received:", data.email);
          data.email = null; // Treat invalid email as not provided
        }
        setOrder(data);
        setError("");
      } catch (err) {
        console.error("Fetch order error:", err.message);
        setError(err.message || "Failed to fetch order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, API_BASE_URL]);

  // Initiate Razorpay payment
  const initiatePayment = async () => {
    if (!window.Razorpay) {
      setError("Payment gateway not loaded. Please refresh the page.");
      return;
    }

    if (!RAZORPAY_KEY) {
      setError("Payment configuration missing. Please contact support.");
      return;
    }

    if (!order?.amount || !order?.orderId) {
      setError("Invalid order details. Please try again.");
      return;
    }

    if (order.email && !isValidEmail(order.email)) {
      setError("Invalid email address. Please update your order details.");
      return;
    }

    setPaymentLoading(true);
    try {
      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(Number(order.amount) * 100),
        currency: "INR",
        order_id: order.orderId,
        name: "Genuine Unlocker",
        description: `${order.model || "Device"} Eligibility Check`,
        handler: async (response) => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
            const result = await res.json();
            if (result.status === "success") {
              alert(
                `✅ Payment completed successfully! ${
                  order.email
                    ? "An invoice has been sent to your email."
                    : "No email provided for invoice delivery."
                }`
              );
              const updated = await fetch(`${API_BASE_URL}/api/order-details/${orderId}`);
              const updatedData = await updated.json();
              if (updated.ok) {
                setOrder(updatedData);
              }
            } else {
              alert("❌ Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("⚠️ Error verifying payment. Please try again.");
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          contact: order.mobileNumber || "",
          email: order.email || "",
        },
        theme: {
          color: "#28a745",
        },
        modal: {
          ondismiss: async () => {
            try {
              await fetch(`${API_BASE_URL}/api/verify-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: order.orderId,
                  paymentId: null,
                  signature: null,
                }),
              });
              const updatedRes = await fetch(`${API_BASE_URL}/api/order-details/${orderId}`);
              const updatedData = await updatedRes.json();
              if (updatedRes.ok) {
                setOrder(updatedData);
              }
              alert("❌ Payment was cancelled.");
            } catch (err) {
              console.error("Error updating failed payment status:", err);
              alert("⚠️ Error updating payment status. Please try again.");
            } finally {
              setPaymentLoading(false);
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError("Failed to initiate payment. Please try again.");
      setPaymentLoading(false);
    }
  };

  // Format date for display
  const formatDateTime = (isoString) => {
    if (!isoString) return "Not available";
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="loader-container">
        <div className="modern-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  // Handle error state with retry option
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message" style={{ color: "red" }}>
          {error}
        </p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
          style={{ marginTop: "10px", padding: "8px 16px" }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Handle case when order is not found
  if (!order) {
    return (
      <div className="error-container">
        <p>Order not found. Please try again later.</p>
        <Link to="/track-order">Track another order</Link>
      </div>
    );
  }

  return (
    <div className="order-page-wrapper">
      <div className="order-container">
        <div className="left-section">
          <h1>
            Order a {order.brand || "Device"} {order.model || "Model"} router unlock for{" "}
            {order.network || "Network"}.
          </h1>
          <p className="description">
            Unlock Your {order.brand || "Device"} {order.model || "Model"} Router for Seamless Use with{" "}
            {order.network || "Network"}.
          </p>

          {(order.paymentStatus === "Success" || order.paymentStatus === "Failed") && (
            <>
              <div className="input-group-order">
                <label>ORDER ID</label>
                <input type="text" value={order.orderId || "N/A"} readOnly />
              </div>
              <div className="input-group-order">
                <label>PAYMENT DATE & TIME</label>
                <input type="text" value={formatDateTime(order.paymentTime)} readOnly />
              </div>
            </>
          )}

          <div className="input-group-order">
            <label>Brand</label>
            <input type="text" value={order.brand || "N/A"} readOnly />
          </div>
          <div className="input-group-order">
            <label>Model</label>
            <input type="text" value={order.model || "N/A"} readOnly />
          </div>
          <div className="input-group-order">
            <label>IMEI Number</label>
            <input type="text" value={order.imei || "N/A"} readOnly />
          </div>
          <div className="input-group-order">
            <label>S/N</label>
            <input type="text" value={order.serialNumber || "N/A"} readOnly />
          </div>
          <div className="input-group-order">
            <label>Network</label>
            <input type="text" value={order.network || "N/A"} readOnly />
          </div>
          <div className="input-group-order">
            <label>WhatsApp Number</label>
            <input type="text" value={order.mobileNumber || "N/A"} readOnly />
          </div>
          <div className="input-group-order">
            <label>Email</label>
            <input
              type="text"
              value={order.email || "Not provided"}
              readOnly
              style={{ width: "100%", minWidth: "200px" }} // Ensure sufficient width
            />
          </div>

          <p className="terms">
            By proceeding, you agree to the{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms
            </a>.
          </p>

          <div className="payment-buttons">
            {order.paymentStatus === "Pending" ? (
              <button
                className="payment-button pay-now"
                onClick={initiatePayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <div className="button-spinner"></div>
                ) : (
                  `💸 Pay Now Rs${order.amount || "0"}`
                )}
              </button>
            ) : (
              <p
                className="payment-status"
                style={{
                  color:
                    order.paymentStatus === "Success"
                      ? "#0e9512"
                      : order.paymentStatus === "Failed"
                      ? "#d00000"
                      : "#000",
                }}
              >
                Payment Status: {order.paymentStatus || "Unknown"}
              </p>
            )}
          </div>

          <p className="note">
            Ensure your device prompts for an unlock code with a non-{order.network || "Network"} SIM. Otherwise, a credit note will be issued.
          </p>

          <p className="track-link">
            Want to track another order? <Link to="/track-order">Click here</Link>
          </p>
        </div>

        <div className="right-section">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>PRODUCT</span>
            <span>TOTAL</span>
          </div>
          <div className="summary-item">
            <span>{order.model || "Device"} Eligibility Check</span>
            <span>Rs{order.amount || "0"}</span>
          </div>
          <div className="logo-container">
            <img src={Logo} alt="Genuine Unlocker Logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;