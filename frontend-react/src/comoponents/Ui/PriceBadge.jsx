// src/components/ui/PriceBadge.jsx
export default function PriceBadge({ price, currency="ARS" }) {
  return <span className="price">{currency} {price.toLocaleString("es-AR")}</span>;
}
