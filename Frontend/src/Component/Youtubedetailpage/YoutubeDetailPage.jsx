import React from 'react';
import { useParams } from 'react-router-dom';
import './YoutubeDetailPage.css';
import { cardData } from "../../cardData.js"; // Import cardData
import { Helmet } from 'react-helmet-async';


// Sample cardData (move to a separate file or context in a real app)

const YoutubeDetailPage = () => {
  const { title } = useParams(); // Get the ID from the URL
  const card = cardData.find((card) => card.title.replace(/\s+/g, "-").toLowerCase() === title.replace(/\s+/g, "-").toLowerCase()); // Find the card by ID

  if (!card) {
    return <div>Youtube not found</div>;
  }

  return (
    <>
      <Helmet>
        <title>{`${card.title} | GenuineUnlocker`}</title>
        <meta name="description" content={card.description} />
        <link rel="canonical" href={`https://genuineunlocker.net/youtube/${title}`} />
      </Helmet>
      <div className="app-container">
        <main className="main">
          <section
            className="hero-section"
            style={{
              backgroundImage: `url('${card.image}')`,
            }}
          >
            <div className="hero-overlay">
              <h2 className="hero-title">{card.title}</h2>
            </div>
          </section>

          <section className="content-section">
            {card.content.map((section, index) => (
              <div key={index}>
                <h3 className="content-title">{section.title}</h3>
                <p className="content-text">{section.text}</p>
              </div>
            ))}

            <div className="video-section">
              <h4 className="video-title">{card.video.title}</h4>
              <div className="video-container">
                <iframe
                  className="video-iframe"
                  src={card.video.url}
                  title={card.video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default YoutubeDetailPage;