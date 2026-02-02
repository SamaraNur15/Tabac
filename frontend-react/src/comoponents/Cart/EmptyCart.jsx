// src/comoponents/Cart/EmptyCart.jsx
import { Link } from 'react-router-dom';
import './EmptyCart.css';

export default function EmptyCart() {
  return (
    <div className="empty-cart">
      <div className="empty-cart__container">
        <div className="empty-cart__icon">🛒</div>
        <h1 className="empty-cart__title">Tu carrito está vacío</h1>
        <p className="empty-cart__text">
          Parece que aún no has agregado ningún item. ¡Explora nuestra carta y encuentra algo delicioso!
        </p>
        <Link to="/carta" className="empty-cart__btn">
          Ir a la Carta
        </Link>
      </div>
    </div>
  );
}
