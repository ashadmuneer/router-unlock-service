import React, { useState } from "react";
import "./Faq.css";

const faqData = [
  {
    question: "What amenities are typically offered in a small hotel?",
    answare:
      "Small hotels often provide free Wi-Fi, complimentary breakfast, daily housekeeping, toiletries, and sometimes access to shared spaces like a lounge or garden.",
  },
  {
    question: "How can a small hotel improve guest satisfaction?",
    answare:
      "By offering personalized service, maintaining cleanliness, responding quickly to requests, providing local recommendations, and ensuring a comfortable stay with good amenities.",
  },
  {
    question:
      "What are the advantages of staying in a small hotel over a large chain?",
    answare:
      "Small hotels often offer a more intimate atmosphere, personalized attention, unique decor, and a local experience compared to the standardized approach of large chains.",
  },
  {
    question: "What challenges do small hotels commonly face?",
    answare:
      "Limited marketing budgets, competition with larger hotels, seasonal demand fluctuations, and maintaining consistent service quality with a small staff.",
  },
  {
    question: "How can a small hotel attract more bookings?",
    answare:
      "By optimizing online presence (website, social media, and OTAs), offering promotions, encouraging guest reviews, providing unique experiences, and leveraging local partnerships.",
  },
  {
    question: "What is the importance of customer reviews for a small hotel?",
    answare:
      "Positive reviews build trust, improve search rankings, attract new guests, and provide feedback for service improvements. Negative reviews, if addressed well, can demonstrate responsiveness.",
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
