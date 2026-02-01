// src/components/ui/SearchBox.jsx
export default function SearchBox({ value, onChange, placeholder }) {
  return (
    <input
      className="search"
      type="search"
      value={value}
      onChange={e=> onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
