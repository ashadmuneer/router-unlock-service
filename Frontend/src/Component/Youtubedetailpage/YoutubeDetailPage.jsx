import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./YoutubeDetailPage.css";
import { Helmet } from "react-helmet-async";

const YoutubeDetailPage = () => {
  const { title } = useParams();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ Fetch specific card by matching slug
  useEffect(() => {
    const loadCard = async () => {
      try {
        // Fetch all cards (disable pagination by setting high limit)
        const response = await fetch(
          `${import.meta.env.VITE_DATA_API_URL}/api/cards?limit=200`
        );

        const res = await response.json();

        // res.data = array of cards
        const cardList = res.data || [];

        // Create slug for comparison
        const slug = (str) =>
          str.replace(/\s+/g, "-").toLowerCase();

        const found = cardList.find(
          (c) => slug(c.title) === slug(title)
        );

        setCard(found || null);
      } catch (error) {
        console.error("Error loading card:", error);
        setCard(null);
      } finally {
        setLoading(false);
      }
    };

    loadCard();
  }, [title]);
  if (loading) {
  return (
    <div className="loading-screen">
      <div className="loading-hero-skeleton"></div>

      <div className="loading-content">
        <div className="loading-line w-60"></div>
        <div className="loading-line w-48"></div>
        <div className="loading-line w-72"></div>

        <div className="loading-video"></div>
      </div>
    </div>
  );
}

  if (!card) return <div className="p-6">Youtube not found</div>;

  return (
    <>
      <Helmet>
        <title>{`${card.title} | GenuineUnlocker`}</title>
        <meta name="description" content={card.description} />
        <link
          rel="canonical"
          href={`https://genuineunlocker.net/youtube/${title}`}
        />
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
            {card.content?.map((section, index) => (
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
                  style={{ border: 0 }}
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
