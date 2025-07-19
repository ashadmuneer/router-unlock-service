import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Blogcard.css";
import { cardData } from "../../cardData.js"; // Replace with your actual path
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

const Blogcard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;
  const blogSectionRef = useRef(null);
  const navigate = useNavigate();

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cardData.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(cardData.length / cardsPerPage);
const scrollOnPageChange = useRef(false);
const isFirstRender = useRef(true);

// Call this on Next/Prev click
const handlePageChange = (newPage) => {
  scrollOnPageChange.current = true;
  setCurrentPage(newPage);
};

useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return; // skip on initial load
  }

  if (scrollOnPageChange.current && blogSectionRef.current) {
    blogSectionRef.current.scrollIntoView({ behavior: "smooth" });
    scrollOnPageChange.current = false;
  }
}, [currentPage]);


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
      </Helmet>
      <div ref={blogSectionRef} className="blogcard-wrapper">
        <div  className="blogcard-heading">
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
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, index) => (
                <span
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? "page-number active" : "page-number"}
                >
                  {index + 1}
                </span>
              ))}
            </div>
            <div className="pagination-buttons">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "disabled" : ""}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "disabled" : ""}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Blogcard;
