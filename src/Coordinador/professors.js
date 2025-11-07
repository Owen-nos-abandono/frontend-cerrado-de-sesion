import React, { useMemo, useState } from "react";
import "./Styles/professors.css";

export default function ProfessorsTab({ professors, setProfessors }) {
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState(""); // activo | inactivo | ""
  const list = useMemo(() => {
    return professors
      .filter(p => q ? (p.name.toLowerCase().includes(q.toLowerCase()) || p.email.toLowerCase().includes(q.toLowerCase())) : true)
      .filter(p => statusF ? (statusF === "activo" ? p.active : !p.active) : true)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [professors, q, statusF]);

  const toggle = (id) => {
    setProfessors(arr => arr.map(p => p.id === id ? ({ ...p, active: !p.active }) : p));
  };

  return (
    <section className="coord-professors">
      <div className="toolbar">
        <input placeholder="Buscar por nombre o correo…" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={statusF} onChange={e=>setStatusF(e.target.value)}>
          <option value="">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
        <div className="spacer" />
      </div>

      <table className="table">
        <thead>
          <tr><th>Profesor</th><th>Correo</th><th>Áreas</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {list.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>
                {p.areas?.length ? (
                  <div className="chips">{p.areas.map(a => <span className="chip" key={a}>{a}</span>)}</div>
                ) : <span className="muted">Sin áreas</span>}
              </td>
              <td><span className={`badge ${p.active ? "ok" : "ko"}`}>{p.active ? "Activo" : "Inactivo"}</span></td>
              <td className="row-actions">
                <button onClick={() => toggle(p.id)}>{p.active ? "Deshabilitar" : "Habilitar"}</button>
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan="5" style={{textAlign:"center",opacity:.7}}>Sin resultados</td></tr>}
        </tbody>
      </table>

      <p className="hint">
        <strong>Nota (HU-001):</strong> Al deshabilitar a un profesor, en producción se debe impedir que registre nuevas asesorías mientras esté inactivo.
      </p>
    </section>
  );
}
