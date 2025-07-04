import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Blogcard.css";
import { cardData } from "../../cardData.js"; // Replace with your actual path

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
    <div className="blogcard-wrapper">
      <div ref={blogSectionRef} className="blogcard-heading">
        <h3>
          Top <span>articles</span> from our <span>Blog</span>
        </h3>
        <p>
          Covering everything you need to know about unlocking and selling routers,
          MiFi/s, wingles, modems and phones.
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
  );
};

export default Blogcard;
