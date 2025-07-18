import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Blogcard.css";
import { cardData } from "../../cardData.js"; // Replace with your actual path
import { Helmet } from "react-helmet-async";

const Blogcard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;
  const blogSectionRef = useRef(null);
  const navigate = useNavigate();

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cardData.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(cardData.length / cardsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (blogSectionRef.current) {
      blogSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCardClick = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Unlock your routers, modems, and MiFi devices instantly for use with any SIM or mobile network worldwide. Whether you're using a Huawei modem, ZTE router, STC 5G device, Zain MiFi, Go Telecom unit, or any other brand, GenuineUnlocker provides fast, secure, and permanent unlock codes delivered online.

No technical skills needed — just enter your device’s IMEI or serial number and receive your unique unlock code via email or SMS. Our unlocking service supports 4G and 5G routers, including popular models from Huawei, ZTE, Oppo, Greenpacket, Brovi, Soyealink, and GHTelcom.

Bypass SIM restrictions, switch carriers freely, and enjoy true network freedom — anytime, anywhere. Trusted by thousands globally, we provide 24/7 support and 100% satisfaction guarantee.

Supported networks: STC, Zain, Go Telecom, Mobily, Etisalat, and more.
Unlock your modem now and use it with any SIM worldwide."
        />
        <link rel="canonical" href="https://genuineunlocker.net/#howtounlock" />
      </Helmet>
      <div className="blogcard-wrapper">
        <div ref={blogSectionRef} className="blogcard-heading">
          <h3>
            Top <span>articles</span> from our <span>Blog</span>
          </h3>
          <p>
            Covering everything you need to know about unlocking Routers, Modems
            And MiFi/s.
          </p>
        </div>

        <div className="blogcard-container">
          {currentCards.map((card) => (
            <div
              className="blogcard"
              key={card.id}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="blogcard-header">
                <img src={card.image} alt="Blog" />
              </div>
              <div className="blogcard-body">
                <span className={`tag ${card.tagColor}`}>{card.tag}</span>
                <h4>{card.title}</h4>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Blogcard;
