import React, { useMemo, useState } from "react";
import "./Styles/students.css";

export default function StudentsTab({ students }) {
  const [q, setQ] = useState("");
  const [carrera, setCarrera] = useState("");

  const list = useMemo(() => {
    return students
      .filter(s => q ? (s.name.toLowerCase().includes(q.toLowerCase()) || s.matricula.toLowerCase().includes(q.toLowerCase())) : true)
      .filter(s => carrera ? s.carrera === carrera : true)
      .sort((a,b) => a.name.localeCompare(b.name));
  }, [students, q, carrera]);

  const carreras = Array.from(new Set(students.map(s => s.carrera)));

  return (
    <section className="teacher-students">
      <div className="toolbar">
        <input placeholder="Buscar por nombre o matrícula…" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={carrera} onChange={e=>setCarrera(e.target.value)}>
          <option value="">Todas las carreras</option>
          {carreras.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="spacer" />
      </div>

      <table className="table">
        <thead>
          <tr><th>Nombre</th><th>Matrícula</th><th>Carrera</th></tr>
        </thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.matricula}</td>
              <td>{s.carrera}</td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan="3" style={{textAlign:"center",opacity:.7}}>Sin resultados</td></tr>}
        </tbody>
      </table>
    </section>
  );
}
