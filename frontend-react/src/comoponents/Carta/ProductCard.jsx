// src/components/carta/ProductCard.jsx
import { useState } from 'react';
import { useCart } from '../../Hooks/useCart';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { agregarAlCarrito } = useCart();
  const [showAdded, setShowAdded] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  const onImgError = (e) => { e.currentTarget.src = "/img/placeholder.jpg"; };
  const precioFmt = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    .format(Number(product.precio || 0));

  // Determinar si el producto está sin stock
  const sinStock = product.stock <= 0 || product.disponible === false;

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito(product, cantidad);
    setShowAdded(true);
    setCantidad(1);
    
    // Mostrar confirmación por 2 segundos
    setTimeout(() => {
      setShowAdded(false);
    }, 2000);
  };

  return (
    <>
      <article className={`card-producto ${sinStock ? 'sin-stock' : ''}`}>
        {sinStock && <div className="badge-sin-stock">Sin Stock</div>}
        {showAdded && <div className="badge-added">✓ Agregado</div>}
      
        <img
          className="card-producto__img"
          src={product.imagen|| "/"}
          alt={product.nombre}
          onError={onImgError}
          loading="lazy"
        />
        <div className="card-producto__body">
          <h3 className="card-producto__title">{product.nombre}</h3>
          {product.descripcion && (
            <p className="card-producto__desc">{product.descripcion}</p>
          )}

          <p className="card-producto__price">{precioFmt}</p>

          <div className="card-producto__footer">
            {!sinStock && (
              <div className="card-producto__qty-controls">
                <button 
                  className="qty-btn qty-btn--minus"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                >
                  −
                </button>
                <input
                  type="number"
                  className="qty-input"
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button 
                  className="qty-btn qty-btn--plus"
                  onClick={() => setCantidad(cantidad + 1)}
                >
                  +
                </button>
              </div>
            )}

            {!sinStock ? (
              <button 
                className="card-producto__btn"
                onClick={handleAgregarAlCarrito}
                disabled={showAdded}
              >
                {showAdded ? '✓ Agregado' : '🛒 Agregar'}
              </button>
            ) : (
              <div className="card-producto__no-disponible">No disponible</div>
            )}
          </div>
        </div>
      </article>
    </>
  );
}