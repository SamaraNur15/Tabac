// src/components/carta/MenuGrid.jsx
import ProductCard from "./ProductCard";
import './MenuGrid.css';

export default function MenuGrid({ items }) {
  if (!items.length) {
    return (
      <div className="no-results">
        <div className="no-results__icon">🔍</div>
        <p className="no-results__text">No se encontraron resultados</p>
        <p className="no-results__subtext">Intenta con otra búsqueda o categoría</p>
      </div>
    );
  }
  
  return (
    <div className="menu-grid">
      {items.map(prod => <ProductCard key={prod._id} product={prod} />)}
    </div>
  );
}
