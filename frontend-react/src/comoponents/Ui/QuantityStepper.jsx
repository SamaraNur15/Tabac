// src/components/ui/QuantityStepper.jsx
export default function QuantityStepper({ value, onChange, min=1 }) {
  return (
    <div className="qty">
      <button onClick={()=> onChange(Math.max(min, value - 1))}>−</button>
      <span>{value}</span>
      <button onClick={()=> onChange(value + 1)}>+</button>
    </div>
  );
}
