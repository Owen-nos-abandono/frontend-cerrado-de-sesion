import React, { useMemo, useState } from "react";
import "./Styles/areas.css";

const CATALOG = [
  "Matemáticas", "Cálculo", "Física", "Química",
  "Programación", "Algoritmos", "Base de Datos",
  "Redacción", "Inglés"
];

export default function AreasTab({ professors, setProfessors }) {
  const [profId, setProfId] = useState("");
  const selected = useMemo(() => professors.find(p => p.id === profId), [professors, profId]);
  const [search, setSearch] = useState("");

  const options = useMemo(() => {
    return CATALOG.filter(a => a.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const toggleArea = (area) => {
    if (!selected) return;
    setProfessors(arr => arr.map(p => {
      if (p.id !== selected.id) return p;
      const set = new Set(p.areas || []);
      set.has(area) ? set.delete(area) : set.add(area);
      return { ...p, areas: Array.from(set).sort() };
    }));
  };

  return (
    <section className="coord-areas">
      <div className="card">
        <h3>Asignar áreas / materias a profesor</h3>
        <div className="grid2">
          <label>Profesor
            <select value={profId} onChange={e=>setProfId(e.target.value)}>
              <option value="">Selecciona…</option>
              {professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>

          <label>Buscar área
            <input placeholder="Filtrar catálogo…" value={search} onChange={e=>setSearch(e.target.value)} />
          </label>
        </div>

        {selected ? (
          <div className="areas-grid">
            {options.map(a => {
              const checked = selected.areas?.includes(a);
              return (
                <label key={a} className={`area-item ${checked ? "on" : ""}`}>
                  <input type="checkbox" checked={!!checked} onChange={() => toggleArea(a)} />
                  <span>{a}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <p className="muted">Selecciona un profesor para ver y asignar áreas.</p>
        )}

        <p className="hint">
          <strong>Regla (HU-002):</strong> las asesorías deben **agendarse con profesores** de la materia/área correspondiente.
          (En producción, el agendador filtrará automáticamente por estas áreas).
        </p>
      </div>
    </section>
  );
}
