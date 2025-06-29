import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UnlockSection from '../Component/MainPage/UnlockSection';
import Blogcard from '../Component/blogcard/Blogcard';
import Faq from '../Component/FAQ/Faq';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash?.substring(1); // removes the "#"
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Give the DOM time to render
    }
  }, [location]);

  return (
    <>
      <div id="home">
        <UnlockSection />
      </div>

      <div id="howtounlock">
        <Blogcard />
      </div>

      <div id="faq">
        <Faq />
      </div>
    </>
  );
};

export default Home;
