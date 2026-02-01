// src/comoponents/Home/CTACarta.jsx
import { Link } from 'react-router-dom';
import './CTACarta.css';

const CTACarta = () => {
  const imagenes = [
    '/img/Kebab.png',
    '/img/niños-envueltos.jpeg',
    '/img/empanadas-arabes-foto.webp',
    '/img/lomito2.jpg',
    '/img/pizza.jpeg',
    '/img/chocotorta.jpg',
    '/img/hamburguesas-caseras.webp',
    '/img/baklava.jpg'
  ];

  return (
    <section className="cta-carta">
      {/* Fondo con collage de imágenes */}
      <div className="cta-carta__bg" aria-hidden="true">
        {imagenes.map((img, index) => (
          <img key={index} src={img} alt="" loading="lazy" />
        ))}
      </div>

      <div className="container">
        <div className="cta-carta__content">
          <h2 className="cta-carta__title">Descubrí nuestra carta</h2>
          <p className="cta-carta__sub">
            Platos árabes, especialidades de la casa y opciones para todos los gustos.
          </p>
          <div className="cta-carta__acciones">
            <Link 
              to="/carta" 
              className="btn-cta-carta" 
              aria-label="Ver la carta completa"
            >
              Ver la carta
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTACarta;
