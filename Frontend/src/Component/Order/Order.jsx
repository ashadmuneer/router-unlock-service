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

  const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/$/, "");
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(
          `${API_BASE_URL}/api/order-details/${orderId}`,
          {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          }
        );
        clearTimeout(timeout);

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Error fetching order.");
        }

        const data = await res.json();
        if (!data?.orderId) throw new Error("Invalid order data.");
        if (!isValidEmail(data.email)) data.email = "";

        setOrder(data);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, API_BASE_URL]);

  // Load PayPal SDK and render
  useEffect(() => {
    if (!order || order.paymentStatus !== "Pending") return;

    const container = document.getElementById("paypal-button-container");

    const loadPayPalSDK = () => {
      if (!PAYPAL_CLIENT_ID) {
        setError("PayPal Client ID missing.");
        return;
      }

      const scriptId = "paypal-sdk";
      const renderWhenReady = () => {
        if (window.paypal) renderPayPalButton();
      };

      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
        script.async = true;

        script.onload = renderWhenReady;
        script.onerror = () =>
          setError("⚠️ Failed to load PayPal. Please refresh.");

        document.body.appendChild(script);
      } else {
        renderWhenReady();
      }
    };

    loadPayPalSDK();

    // ResizeObserver: Retry if container becomes visible later (mobile fix)
    const observer = new ResizeObserver(() => {
      if (window.paypal && container?.children?.length === 0) {
        renderPayPalButton();
      }
    });

    if (container) observer.observe(container);

    return () => observer.disconnect();
  }, [order, PAYPAL_CLIENT_ID]);

  const renderPayPalButton = () => {
    const container = document.getElementById("paypal-button-container");
    if (!window.paypal || !order?.orderId || !order?.amount || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width < 100 || rect.height < 30) return;

    if (container.children.length > 0) return;

    window.paypal
      .Buttons({
        createOrder: () => order.orderId,
        onApprove: async (data) => {
          setPaymentLoading(true);
          try {
            const response = await fetch(`${API_BASE_URL}/api/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            });
            const result = await response.json();

            if (result.status === "success") {
              alert(
                `✅ Payment completed! ${
                  order.email ? "Invoice sent to email." : "No email provided."
                }`
              );
              const updated = await fetch(
                `${API_BASE_URL}/api/order-details/${orderId}`
              );
              const updatedData = await updated.json();
              if (updated.ok) setOrder(updatedData);
            } else {
              alert("❌ Payment verification failed.");
            }
          } catch (err) {
            alert("⚠️ Payment verification failed.");
          } finally {
            setPaymentLoading(false);
          }
        },
        onCancel: () => {
          alert("❌ Payment was not completed. User cancelled the payment.");
          setPaymentLoading(false);
        },
        onError: (err) => {
          console.error("PayPal Error:", err);
          setError("❌ PayPal failed. Please try again.");
          setPaymentLoading(false);
        },
      })
      .render(container);
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "Not available";
    const date = new Date(isoString);
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleString("en-IN", {
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

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message" style={{ color: "red" }}>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <p>Order not found.</p>
        <Link to="/track-order">Track another order</Link>
      </div>
    );
  }

  return (
    <div className="order-page-wrapper">
      <div className="order-container">
        <div className="left-section">
          <h1>
            Order a {order.brand || "Device"} {order.model || "Model"} router unlock for {order.network || "Network"}.
          </h1>
          <p className="description">
            Unlock your {order.brand || "Device"} router for seamless use with {order.network || "Network"}.
          </p>

          {(order.paymentStatus === "Success" || order.paymentStatus === "Failed") && (
            <>
              <div className="input-group-order">
                <label>ORDER ID</label>
                <input value={order.orderId} readOnly />
              </div>
              <div className="input-group-order">
                <label>PAYMENT DATE & TIME</label>
                <input value={formatDateTime(order.paymentTime)} readOnly />
              </div>
            </>
          )}

          <div className="input-group-order"><label>Brand</label><input value={order.brand || "N/A"} readOnly /></div>
          <div className="input-group-order"><label>Model</label><input value={order.model || "N/A"} readOnly /></div>
          <div className="input-group-order"><label>IMEI Number</label><input value={order.imei || "N/A"} readOnly /></div>
          <div className="input-group-order"><label>S/N</label><input value={order.serialNumber || "N/A"} readOnly /></div>
          <div className="input-group-order"><label>Network</label><input value={order.network || "N/A"} readOnly /></div>
          <div className="input-group-order"><label>WhatsApp Number</label><input value={order.mobileNumber || "Not provided"} readOnly /></div>
          <div className="input-group-order"><label>Email</label><input value={order.email || "Not provided"} readOnly /></div>

          <div className="payment-buttons">
            {order.paymentStatus === "Pending" ? (
              <div className="paypal-button-wrapper">
                <div id="paypal-button-container" />
              </div>
            ) : (
              <p className="payment-status" style={{
                color: order.paymentStatus === "Success"
                  ? "#0e9512"
                  : order.paymentStatus === "Failed"
                  ? "#d00000"
                  : "#000"
              }}>
                Payment Status: {order.paymentStatus || "Unknown"}
              </p>
            )}
          </div>

          {paymentLoading && (
            <div className="loader-overlay">
              <div className="modern-spinner"></div>
              <p>Processing Payment...</p>
            </div>
          )}

          <p className="note">
            Ensure your device prompts for an unlock code with a non-{order.network || "Network"} SIM. Otherwise, a credit note will be issued.
          </p>

          <p className="track-link">
            Want to track another order? <Link to="/track-order">Click here</Link>
          </p>
        </div>

        <div className="right-section">
          <h2>Order Summary</h2>
          <div className="summary-item"><span>PRODUCT</span><span>TOTAL</span></div>
          <div className="summary-item">
            <span>{order.brand || "Device"} {order.model || "Model"} Unlock Code</span>
            <span>USD {order.amount || "0"}</span>
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
