// src/comoponents/Home/FAQSection.jsx
import { useState } from 'react';
import './FAQSection.css';

const FAQSection = () => {
  const faqs = [
    {
      id: 1,
      pregunta: '¿Qué medios de pago acepta Tabac?',
      respuesta: 'Aceptamos efectivo, tarjetas de crédito/débito y Mercado Pago.'
    },
    {
      id: 2,
      pregunta: 'Contactanos',
      respuesta: 'Podés escribirnos vía WhatsApp, redes o completando el formulario de contacto.'
    },
    {
      id: 3,
      pregunta: '¿Quiénes Somos?',
      respuesta: `
        <p>
          Somos <strong>Tabac</strong>, un restaurante familiar con más de 30 años de historia 
          en San Salvador de Jujuy, dedicado a ofrecer lo mejor de la gastronomía árabe y regional.
        </p>
        <p>
          Desde nuestros inicios, mantenemos viva una tradición que combina recetas transmitidas 
          de generación en generación con un toque moderno que nos permite innovar sin perder 
          nuestra esencia. Nuestro compromiso es brindar no solo platos auténticos y sabrosos, 
          sino también un espacio cálido y acogedor donde cada visita se convierte en una experiencia única.
        </p>
        <p>
          Creemos en la importancia de la <em>calidad</em>, la <em>hospitalidad</em> y el 
          <em>respeto por nuestras raíces</em>. Por eso seleccionamos cuidadosamente cada 
          ingrediente y trabajamos con un equipo apasionado que comparte la misma visión: que 
          cada cliente se sienta como en casa.
        </p>
        <p>
          Hoy, Tabac es más que un restaurante: es un punto de encuentro donde familias, amigos 
          y visitantes pueden disfrutar de buena comida, un ambiente agradable y la calidez que 
          nos caracteriza.
        </p>
      `
    }
  ];

  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq-acordeon" aria-label="Preguntas frecuentes">
      <h2 className="faq-titulo">¿Necesitás alguna razón más?</h2>

      {faqs.map((faq) => (
        <details 
          key={faq.id} 
          className="faq-item"
          open={openId === faq.id}
          onClick={(e) => {
            e.preventDefault();
            toggleFAQ(faq.id);
          }}
        >
          <summary className="faq-pregunta">{faq.pregunta}</summary>
          <div 
            className="faq-respuesta"
            dangerouslySetInnerHTML={{ __html: faq.respuesta }}
          />
        </details>
      ))}
    </section>
  );
};

export default FAQSection;
