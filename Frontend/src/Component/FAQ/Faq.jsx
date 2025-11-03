import React, { useState } from "react";
import "./Faq.css";

const faqData = [
  {
    question: "How do I unlock my router with IMEI?",
    answare:
      "Unlocking your router with its IMEI is the safest method. Simply provide us with your 15-digit IMEI number, and we will generate a unique unlock code for your device. Enter this code when prompted, and your router will be permanently unlocked to use with any carrier.",
  },
  {
    question: "What is the best router unlock tool?",
    answare:
      "While software tools like DC-Unlocker exist, the best and most universal router unlock tool is an online IMEI-based service like ours. It is safer, requires no software installation, and guarantees a permanent unlock for your specific device, whether it is a Huawei, ZTE, or any other brand.",
  },
  {
    question: "Can I unlock 5G routers for free?",
    answare:
      "While some free unlocking solutions are advertised, they are often unreliable or risky for new 5G devices. For a guaranteed and safe unlock, we provide a premium, one-time service that permanently unlocks your 5G router, allowing you to use any SIM card without issues.",
  },
  {
    question: "Can I find a router unlock software for free download?",
    answare:
      "While a free download for a router unlock software might seem appealing, they often carry risks like malware or may not support your device. Our service acts as a universal router unlocker tool, providing a safe, guaranteed unlock code generated from your IMEI without requiring any risky downloads.",
  },
  {
    question: "How can I unlock my MiFi online?",
    answare:
      "You can easily unlock your MiFi online with our service. Just provide your device's IMEI number on our website, and our IMEI router unlock code generator will create a unique code for you. It's a simple, fast, and secure process.",
  },
  {
    question: "Is it possible to unlock my router without DC-Unlocker?",
    answare:
      "Yes, absolutely. Our service is a popular and effective alternative for unlocking your router without DC-Unlocker. We provide a straightforward unlock code based on your device's IMEI, so you don't have to deal with complex software or drivers.",
  },
  {
    question: "How can I unlock my router for free?",
    answare:
      "While some free tools exist, they can be risky and may not work for newer models. We offer a safe, guaranteed, and affordable router unlock service to ensure your device is unlocked correctly and permanently without any damage.",
  },
  {
    question: "What is the best router unlock software for 2025?",
    answare:
      "The best software depends on your router's brand and model. DC-Unlocker is a popular choice for Huawei and ZTE, but our online service provides a universal solution that doesn't require complex software downloads. We provide the unlock code directly to you.",
  },
  {
    question: "Can I unlock my router using its IMEI number?",
    answare:
      "Yes, IMEI-based unlocking is the safest and most effective method. You provide us with your router's IMEI, and we generate a unique unlock code that permanently frees your device from network restrictions.",
  },
  {
    question: "Is it possible to unlock a 5G router without software?",
    answare:
      "Absolutely. Our service allows you to unlock any 5G router using a simple code. No software installation is needed. Just enter the code we provide, and your router will be ready to use with any SIM card.",
  },
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
