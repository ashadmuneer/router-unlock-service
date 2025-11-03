import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Youtubecard.css";
import { cardData } from "../../cardData.js"; import { useEffect } from "react";

const Youtubecard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;
  const YoutubeSectionRef = useRef(null);
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

  if (scrollOnPageChange.current && YoutubeSectionRef.current) {
    YoutubeSectionRef.current.scrollIntoView({ behavior: "smooth" });
    scrollOnPageChange.current = false;
  }
}, [currentPage]);


  const handleCardClick = (title) => {
    navigate(`/Youtube/${title.replace(/\s+/g, "-").toLowerCase()}`);
  };

  return (
    <>
      <div ref={YoutubeSectionRef} className="Youtubecard-wrapper">
        <div  className="Youtubecard-heading">
          <h3>
            Best <span> Router & MiFi </span>Unlocking Videos
          </h3>
          <p>
            Watch step-by-step guides and tutorials from our YouTube channel to easily unlock your router or MiFi device
          </p>
        </div>

        <div className="Youtubecard-container">
          {currentCards.map((card) => (
            <div
              className="Youtubecard"
              key={card.id}
              onClick={() => handleCardClick(card.title)}
            >
              <div className="Youtubecard-header">
                <img src={card.image} alt={card.title} />
              </div>
              <div className="Youtubecard-body">
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

export default Youtubecard;
