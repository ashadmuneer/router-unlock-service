import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Order.css";
import Logo from "../../assets/Genuine Unlocker Logo.png";

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onerror = () => setError("Failed to load Razorpay script");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/order-details/${orderId}`
        );
        const data = await response.json();
        if (response.ok) {
          setOrder(data);
        } else {
          setError(data.error || "Failed to fetch order details");
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError("An error occurred while fetching order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const initiatePayment = async () => {
    if (!window.Razorpay) {
      setError("Razorpay script not loaded. Please try again.");
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      setError("Razorpay key is missing. Please contact support.");
      return;
    }

    setPaymentLoading(true);
    try {
      const options = {
        key: razorpayKey,
        amount: (order.amount || 0) * 100,
        currency: "INR",
        order_id: order.orderId,
        name: "Genuine Unlocker",
        description: `${order.model} Eligibility Check`,
        handler: async function (response) {
          try {
            const res = await fetch(
              "http://localhost:5000/api/verify-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              }
            );
            const result = await res.json();
            if (result.status === "success") {
              alert("✅ Payment completed successfully! An invoice has been sent to your email.");
              const updated = await fetch(
                `http://localhost:5000/api/order-details/${orderId}`
              );
              const updatedData = await updated.json();
              if (updated.ok) {
                setOrder(updatedData);
              }
            } else {
              alert("❌ Payment verification failed.");
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            alert("⚠️ Error verifying payment. Please try again.");
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          contact: order.mobileNumber,
          email: order.email, // Prefill customer email from order
        },
        theme: {
          color: "#28a745",
        },
        modal: {
          ondismiss: async function () {
            alert("❌ Payment was cancelled.");

            // Mark payment as failed
            try {
              await fetch("http://localhost:5000/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: order.orderId,
                  paymentId: null,
                  signature: null,
                }),
              });

              // Update UI
              const updatedRes = await fetch(
                `http://localhost:5000/api/order-details/${orderId}`
              );
              const updatedData = await updatedRes.json();
              if (updatedRes.ok) setOrder(updatedData);
            } catch (err) {
              console.error("Error updating failed status:", err);
            }

            setPaymentLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      setError("Failed to initiate payment.");
      setPaymentLoading(false);
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="modern-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error)
    return (
      <p className="error-message" style={{ color: "red" }}>
        {error}
      </p>
    );
  if (!order) return <p>Please try again later.</p>;

  return (
    <div className="order-page-wrapper">
      <div className="order-container">
        <div className="left-section">
          <h1>Order a {order.brand} {order.model} router unlock for {order.network}.</h1>
          <p className="description">
            Unlock Your {order.brand} {order.model} Router for Seamless Use with {order.network}.
          </p>

          {(order.paymentStatus === "Success" ||
            order.paymentStatus === "Failed") && (
            <>
              <div className="input-group-order">
                <label>ORDER ID</label>
                <input type="text" value={order.orderId} readOnly />
              </div>
              <div className="input-group-order">
                <label>PAYMENT DATE & TIME</label>
                <input
                  type="text"
                  value={formatDateTime(order.paymentTime)}
                  readOnly
                />
              </div>
            </>
          )}

          <div className="input-group-order">
            <label>Brand</label>
            <input type="text" value={order.brand} readOnly />
          </div>

          <div className="input-group-order">
            <label>Model</label>
            <input type="text" value={order.model} readOnly />
          </div>

          <div className="input-group-order">
            <label>Imei Number</label>
            <input type="text" value={order.imei} readOnly />
          </div>

          <div className="input-group-order">
            <label>S/N</label>
            <input type="text" value={order.serialNumber} readOnly />
          </div>
          <div className="input-group-order">
            <label>Network</label>
            <input type="text" value={order.network} readOnly />
          </div>

          <div className="input-group-order">
            <label>WhatsApp Number</label>
            <input type="text" value={order.mobileNumber} readOnly />
          </div>

          <div className="input-group-order">
            <label>EMAIL</label>
            <input type="text" value={order.email || "Not provided"} readOnly />
          </div>

          {/* <p className="terms">
            By proceeding, you agree to the{" "}
            <a href="#" target="_blank" rel="noopener noreferrer">
              Terms
            </a>
            .
          </p> */}

          <div className="payment-buttons">
            {order.orderId && order.paymentStatus === "Pending" ? (
              <button
                className="payment-button pay-now"
                onClick={initiatePayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <div className="button-spinner"></div>
                ) : (
                  `💸 Pay Now Rs${order.amount}`
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
                Payment Status: {order.paymentStatus}
              </p>
            )}
          </div>

          <p className="note">
            Ensure your device prompts for an unlock code with a non-
            {order.network} SIM. Otherwise, a credit note will be issued.
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
            <span>{order.model} Eligibility Check</span>
            <span>Rs{order.amount}</span>
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