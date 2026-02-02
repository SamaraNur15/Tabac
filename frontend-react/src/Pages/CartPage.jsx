// src/Pages/CartPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Hooks/useCart';
import { useOrden } from '../Hooks/useOrden';
import { authService } from '../utils/auth';
import CartItem from '../comoponents/Cart/CartItem';
import CartSummary from '../comoponents/Cart/CartSummary';
import EmptyCart from '../comoponents/Cart/EmptyCart';
import './CartPage.css';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, actualizarCantidad, eliminarDelCarrito, vaciarCarrito } = useCart();
  const { crearOrden, loading: creatingOrder } = useOrden();
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    modo: 'retiro',
    direccion: '',
    notas: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isAuthenticated = authService.isAuthenticated();
  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    try {
      setError(null);
      const orden = await crearOrden(deliveryData, { metodo: paymentMethod });
      setSuccess(true);
      vaciarCarrito();
      
      // Redirigir a página de confirmación después de 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al crear la orden');
    }
  };

  if (items.length === 0 && !success) {
    return <EmptyCart />;
  }

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        <h1 className="cart-page__title">Tu Carrito</h1>

        {error && (
          <div className="cart-page__error">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="cart-page__success">
            <p>✓ Pedido creado exitosamente. Redirigiendo...</p>
          </div>
        )}

        <div className="cart-page__content">
          <div className="cart-page__items">
            {items.map(item => (
              <CartItem
                key={item._id}
                item={item}
                onRemove={eliminarDelCarrito}
                onQuantityChange={actualizarCantidad}
              />
            ))}
          </div>

          <aside className="cart-page__sidebar">
            <CartSummary
              items={items}
              total={total}
              onCheckout={() => setShowDeliveryForm(true)}
              loading={creatingOrder}
            />

            {showDeliveryForm && isAuthenticated && (
              <div className="delivery-form">
                <h3 className="delivery-form__title">Detalles de Entrega</h3>

                <div className="form-group">
                  <label className="form-label">Modo de entrega</label>
                  <select
                    className="form-select"
                    value={deliveryData.modo}
                    onChange={(e) =>
                      setDeliveryData({ ...deliveryData, modo: e.target.value })
                    }
                  >
                    <option value="retiro">Retiro en local</option>
                    <option value="domicilio">Entrega a domicilio</option>
                  </select>
                </div>

                {deliveryData.modo === 'domicilio' && (
                  <div className="form-group">
                    <label className="form-label">Dirección</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: Calle 123, Apto 4"
                      value={deliveryData.direccion}
                      onChange={(e) =>
                        setDeliveryData({ ...deliveryData, direccion: e.target.value })
                      }
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Notas adicionales</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Ej: Sin cebolla, extra picante..."
                    value={deliveryData.notas}
                    onChange={(e) =>
                      setDeliveryData({ ...deliveryData, notas: e.target.value })
                    }
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Método de pago</label>
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta de crédito/débito</option>
                  </select>
                </div>

                <button
                  className="delivery-form__submit"
                  onClick={handleCheckout}
                  disabled={creatingOrder}
                >
                  {creatingOrder ? 'Procesando...' : 'Confirmar Pedido'}
                </button>

                <button
                  className="delivery-form__cancel"
                  onClick={() => setShowDeliveryForm(false)}
                  disabled={creatingOrder}
                >
                  Cancelar
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
