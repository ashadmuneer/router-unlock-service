import React, { useState } from "react";
import "./Faq.css";

const faqData = [
  {
    question: "Will factory resetting the device cause it to lock again?",
    answare:
      "No, factory resetting the device will not cause it to lock again. Once a device is unlocked, it remains permanently unlocked, and a factory reset does not re-lock it.",
  },
  {
    question: "Will unlocking void the router’s warranty?",
    answare:
      "No, unlocking does not void the router’s warranty. IMEI-based unlocking, recommended by manufacturers, does not harm the device’s hardware or software, so the warranty remains intact.",
  },
  {
    question: "Will the device support all mobile operator SIMs after unlocking?",
    answare:
      "Yes, after unlocking, the device will work with SIMs from all compatible mobile operators, provided the network is technologically compatible (e.g., GSM or CDMA). However, you should check the device’s IMEI for network compatibility with the new carrier.",
  },
  {
    question: "Does the device need to be unlocked only once?",
    answare:
      "Yes, the device only needs to be unlocked once. After using the unlock code or process, the device is permanently unlocked, and no further unlocking is required.",
  },
  {
    question: "Will the device remain permanently unlocked with the unlocking code?",
    answare:
      "Yes, the device stays permanently unlocked after using the unlocking code. The code removes the SIM lock permanently, and the device will not re-lock, even after software updates or resets.",
  },
  {
    question: "Will unlocking reduce internet speed?",
    answare:
      "No, unlocking does not affect internet speed. Internet speed depends on the device’s hardware, network coverage, and carrier frequency bands, not the unlocking process.",
  },
  {
    question: "What is the process after payment is done?",
    answare:
      "After payment is completed, the unlocking process begins: You’ll need to provide your device’s IMEI number, model, and current network provider. The service provider or unlock team will then process your request and send you the unlock code or step-by-step instructions via email or on-screen prompts.",
  },
  {
    question: "How can I contact support for any queries?",
    answare:
      'For any queries, you can contact support exclusively via email. Reach out to your carrier’s support email  genuineunlockerinfo@gmail.com',
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleVisibility = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
  <div className="faq-box">
    <p className="faq-title">Frequently asked questions</p>

    {faqData.map((item, index) => (
      <div className="faq-item" key={index}>
        <div
          className="faq-question"
          onClick={() => toggleVisibility(index)}
        >
          <p>{item.question}</p>
          <span
            className={`faq-icon material-icons ${
              activeIndex === index ? "rotate" : ""
            }`}
          >
            ▼
          </span>
        </div>
        <div
          className={`faq-answer-container ${
            activeIndex === index ? "open" : ""
          }`}
        >
          <p className="faq-answer">{item.answare}</p>
        </div>
      </div>
    ))}
  </div>
</div>
  );
};

export default Faq;
