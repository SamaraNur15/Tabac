// src/comoponents/Cart/CartItem.jsx
import { useState } from 'react';

export default function CartItem({ item, onRemove, onQuantityChange }) {
  const [cantidad, setCantidad] = useState(item.cantidad);

  const precioFmt = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(item.precio || 0));

  const subtotalFmt = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number((item.precio * cantidad) || 0));

  const handleIncrement = () => {
    const newCantidad = cantidad + 1;
    setCantidad(newCantidad);
    onQuantityChange(item._id, newCantidad);
  };

  const handleDecrement = () => {
    if (cantidad > 1) {
      const newCantidad = cantidad - 1;
      setCantidad(newCantidad);
      onQuantityChange(item._id, newCantidad);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item__image">
        <img 
          src={item.imagen || '/img/placeholder.jpg'} 
          alt={item.nombre}
          onError={(e) => { e.currentTarget.src = '/img/placeholder.jpg'; }}
        />
      </div>

      <div className="cart-item__info">
        <h3 className="cart-item__name">{item.nombre}</h3>
        {item.descripcion && (
          <p className="cart-item__description">{item.descripcion}</p>
        )}
        <p className="cart-item__price">{precioFmt}</p>
      </div>

      <div className="cart-item__controls">
        <div className="qty-counter">
          <button 
            className="qty-counter__btn qty-counter__btn--minus"
            onClick={handleDecrement}
            disabled={cantidad === 1}
          >
            −
          </button>
          <input
            type="number"
            className="qty-counter__input"
            value={cantidad}
            onChange={(e) => {
              const val = Math.max(1, parseInt(e.target.value) || 1);
              setCantidad(val);
              onQuantityChange(item._id, val);
            }}
            min="1"
          />
          <button 
            className="qty-counter__btn qty-counter__btn--plus"
            onClick={handleIncrement}
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-item__subtotal">
        <p className="cart-item__subtotal-label">Subtotal</p>
        <p className="cart-item__subtotal-amount">{subtotalFmt}</p>
      </div>

      <button 
        className="cart-item__remove"
        onClick={() => onRemove(item._id)}
        title="Eliminar del carrito"
      >
        ✕
      </button>
    </div>
  );
}
