// src/components/ui/CategoryTabs.jsx
export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="category-tabs">
      {categories.map(cat => (
        <button
          key={cat}
          className={cat === active ? "tab active" : "tab"}
          onClick={()=> onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
