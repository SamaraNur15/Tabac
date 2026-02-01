// src/Pages/HomePage.jsx
import PromoBanner from '../comoponents/Home/PromoBanner';
import CTACarta from '../comoponents/Home/CTACarta';
import RegistroCTA from '../comoponents/Home/RegistroCTA';
import FAQSection from '../comoponents/Home/FAQSection';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <PromoBanner />
      <CTACarta />
      <RegistroCTA />
      <FAQSection />
    </div>
  );
}

export default HomePage;
