import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Youtubecard.css";

const Youtubecard = () => {
  const [cards, setCards] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  const YoutubeSectionRef = useRef(null);
  const scrollOnPageChange = useRef(false);
  const isFirstRender = useRef(true);

  const navigate = useNavigate();

  // ⭐ Load paginated cards from backend
  useEffect(() => {
    const loadCards = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_DATA_API_URL}/api/cards?page=${currentPage}&limit=${cardsPerPage}`
        );

        const res = await response.json();

        // res.data = card array
        // res.pages = total pages
        setCards(res.data || []);
        setTotalPages(res.pages || 1);
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    };

    loadCards();
  }, [currentPage]);

  // ⭐ Scroll to top when page changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (scrollOnPageChange.current && YoutubeSectionRef.current) {
      YoutubeSectionRef.current.scrollIntoView({ behavior: "smooth" });
      scrollOnPageChange.current = false;
    }
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    scrollOnPageChange.current = true;
    setCurrentPage(newPage);
  };

  const handleCardClick = (title) => {
    navigate(`/Youtube/${title.replace(/\s+/g, "-").toLowerCase()}`);
  };

  return (
    <>
      <div ref={YoutubeSectionRef} className="Youtubecard-wrapper">
        <div className="Youtubecard-heading">
          <h3>
            Best <span> Router & MiFi </span>Unlocking Videos
          </h3>
          <p>
            Watch step-by-step guides and tutorials from our YouTube channel to
            easily unlock your router or MiFi device
          </p>
        </div>

        {/* ⭐ Cards */}
        <div className="Youtubecard-container">
          {cards.length === 0 && <p>No videos available.</p>}

          {cards.map((card) => (
            <div
              className="Youtubecard"
              key={card._id}
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

        {/* ⭐ Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, index) => (
                <span
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={
                    currentPage === index + 1
                      ? "page-number active"
                      : "page-number"
                  }
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
              >
                Prev
              </button>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "disabled" : ""}
                disabled={currentPage === totalPages}
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
