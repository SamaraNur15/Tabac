// src/comoponents/Cart/CartSummary.jsx
import { useNavigate } from 'react-router-dom';
import { authService } from '../../utils/auth';
import './CartSummary.css';

export default function CartSummary({ items, total, onCheckout, loading }) {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (onCheckout) {
      onCheckout();
    }
  };

  const totalFmt = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(total || 0));

  return (
    <div className="cart-summary">
      <div className="cart-summary__content">
        <h2 className="cart-summary__title">Resumen del Pedido</h2>

        <div className="cart-summary__divider"></div>

        <div className="cart-summary__row">
          <span className="cart-summary__label">Cantidad de items:</span>
          <span className="cart-summary__value">
            {items.reduce((sum, item) => sum + item.cantidad, 0)}
          </span>
        </div>

        <div className="cart-summary__row">
          <span className="cart-summary__label">Subtotal:</span>
          <span className="cart-summary__value">{totalFmt}</span>
        </div>

        <div className="cart-summary__divider"></div>

        <div className="cart-summary__row cart-summary__row--total">
          <span className="cart-summary__label">Total:</span>
          <span className="cart-summary__value">{totalFmt}</span>
        </div>

        <button
          className="cart-summary__btn"
          onClick={handleCheckout}
          disabled={loading || items.length === 0}
        >
          {loading ? 'Procesando...' : 'Proceder al Pago'}
        </button>

        {!isAuthenticated && (
          <p className="cart-summary__note">
            Debes iniciar sesión para completar tu pedido
          </p>
        )}
      </div>
    </div>
  );
}
