// src/components/carta/ProductCard.jsx
import './ProductCard.css';

export default function ProductCard({ product }) {

    const onImgError = (e) => { e.currentTarget.src = "/img/placeholder.jpg"; };
    const precioFmt = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    .format(Number(product.precio || 0));

    // Determinar si el producto está sin stock
    const sinStock = product.stock <= 0 || product.disponible === false;

  return (
    <>
      <article className={`card-producto ${sinStock ? 'sin-stock' : ''}`}>
        {sinStock && <div className="badge-sin-stock">Sin Stock</div>}
      
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

        {!sinStock ? (
          <div className="card-producto__disponible">Disponible</div>
        ) : (
          <div className="card-producto__disponible">No disponible</div>
        )}
        </div>
      </article>
    </>
  );
}