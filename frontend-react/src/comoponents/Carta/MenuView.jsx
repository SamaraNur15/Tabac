// src/components/carta/MenuView.jsx
import { useMemo, useState } from "react";
import useMenuData from "../../Hooks/useMenuData.js";;
import MenuGrid from "./MenuGrid";
import { useDebouncedValue } from "../../Hooks/useDebouncedValue.js";
import './MenuView.css'; 

function MenuView() {
  const { items, loading } = useMenuData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("relevancia"); // precio-asc, precio-desc, nombre-asc

  const searchDebounced = useDebouncedValue(search, 200);

  // Asegurar que items sea siempre un array
  const safeItems = Array.isArray(items) ? items : [];

  const categories = useMemo(()=>{
    const cats = new Set(safeItems.map(i => i.categoria));
    return ["Todos", ...Array.from(cats)];
  }, [safeItems]);

  const filtered = useMemo(()=>{
    let list = safeItems;
    if (category !== "Todos") list = list.filter(i => i.categoria === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.nombre.toLowerCase().includes(q) ||
        i.descripcion?.toLowerCase().includes(q)
      );
    }
    if (sortBy === "precio-asc") list = [...list].sort((a,b)=> a.precio - b.precio);
    if (sortBy === "precio-desc") list = [...list].sort((a,b)=> b.precio - a.precio);
    if (sortBy === "nombre-asc") list = [...list].sort((a,b)=> a.nombre.localeCompare(b.nombre));
    return list;
  }, [items, category, search, sortBy]);

  if (loading) return <p className="carta">Cargando carta…</p>;
  

  return (
    <section className="carta">
      <h2 className="carta__title">Carta</h2>

      <div className="filters-bar">
        <div className="chips">
          {categories.map(cat => (
            <button
              key={cat}
              className={`chip ${cat === category ? "chip--active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="filters-row">
          <input
            className="input"
            type="search"
            placeholder="Buscar en la carta…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevancia">Relevancia</option>
            <option value="precio-asc">Precio ↑</option>
            <option value="precio-desc">Precio ↓</option>
            <option value="nombre-asc">Nombre A–Z</option>
          </select>
        </div>
      </div>

      <MenuGrid items={filtered} />
    </section>
  );
}

export default MenuView;