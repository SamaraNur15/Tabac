// src/components/ui/SortSelect.jsx
export default function SortSelect({ value, onChange, options }) {
  return (
    <select value={value} onChange={e=> onChange(e.target.value)}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
