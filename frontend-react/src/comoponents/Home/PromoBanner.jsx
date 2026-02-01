// src/comoponents/Home/PromoBanner.jsx
import './PromoBanner.css';

const PromoBanner = () => {
  const pedidosYaUrl = 'https://www.pedidosya.com.ar/restaurantes/san-salvador-de-jujuy/caffe-tabac-89a34b3f-05fa-4fc9-9147-7e368286daa8-menu?origin=shop_list';

  return (
    <section className="promo-banner">
      <div className="promo-contenido">
        <div className="promo-logo">
          <img src="/img/pedidos-ya-logo.png" alt="Pedidos Ya" />
        </div>
        <h2 className="promo-texto">¡Nos encontramos en Pedidos Ya!</h2>
        <a
          href={pedidosYaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ordena"
        >
          ORDENAR AHORA
        </a>
      </div>
    </section>
  );
};

export default PromoBanner;
