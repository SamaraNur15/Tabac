// src/comoponents/Ui/FloatingPedidosYa.jsx
import { useState, useEffect } from 'react';
import './FloatingPedidosYa.css';

const FloatingPedidosYa = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pedidosYaUrl = 'https://www.pedidosya.com.ar/restaurantes/san-salvador-de-jujuy/caffe-tabac-89a34b3f-05fa-4fc9-9147-7e368286daa8-menu?origin=shop_list';

  useEffect(() => {
    // Mostrar el botón después de hacer scroll 200px
    const toggleVisibility = () => {
      if (window.pageYOffset > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const handleClick = () => {
    window.open(pedidosYaUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`floating-pedidosya ${isVisible ? 'visible' : ''}`}>
      <button 
        onClick={handleClick}
        className="pedidosya-float-btn"
        aria-label="Pedir en Pedidos Ya"
        title="Hace tu pedido en Pedidos Ya"
      >
        {/* Logo de Pedidos Ya - Imagen real */}
        <img 
          src="/img/pedidos-ya-logo.png" 
          alt="Pedidos Ya" 
          className="pedidosya-icon"
        />
        
        {/* Tooltip */}
        <span className="tooltip">Pedir ahora</span>
      </button>
    </div>
  );
};

export default FloatingPedidosYa;
