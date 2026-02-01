// src/components/carta/MenuFilters.jsx
import SearchBox from "../ui/SearchBox";
import CategoryTabs from "../ui/CategoryTabs";
import SortSelect from "../ui/SortSelect";

export default function MenuFilters({
  categories, category, onCategoryChange,
  search, onSearchChange,
  sortBy, onSortChange
}) {
  return (
    <div className="menu-filters">
      <CategoryTabs
        categories={categories}
        active={category}
        onChange={onCategoryChange}
      />
      <div className="filters-row">
        <SearchBox value={search} onChange={onSearchChange} placeholder="Buscar en la carta..." />
        <SortSelect value={sortBy} onChange={onSortChange}
          options={[
            { value: "relevancia", label: "Relevancia" },
            { value: "precio-asc", label: "Precio ↑" },
            { value: "precio-desc", label: "Precio ↓" },
            { value: "nombre-asc", label: "Nombre A–Z" }
          ]}
        />
      </div>
    </div>
  );
}
