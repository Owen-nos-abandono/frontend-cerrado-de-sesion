import React, { useMemo, useState } from "react";
import "./Styles/sessions.css";

export default function SessionsTab({ sessions, setSessions, students }) {
  const [q, setQ] = useState("");
  const [range, setRange] = useState("upcoming"); // upcoming | all
  const [edit, setEdit] = useState(null); // {id,date,time,topic}
  const [toast, setToast] = useState("");

  const list = useMemo(() => {
    const now = new Date();
    return sessions
      .filter(s => (range === "upcoming" ? new Date(s.datetime) >= now : true))
      .filter(s => q ? (s.studentName.toLowerCase().includes(q.toLowerCase()) || s.studentMatricula.toLowerCase().includes(q.toLowerCase()) || s.topic?.toLowerCase().includes(q.toLowerCase())) : true)
      .sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
  }, [sessions, q, range]);

  const cancel = (id) => {
    setSessions(arr => arr.map(s => s.id === id ? { ...s, status: "canceled" } : s));
    notify("Asesoría cancelada (estado actualizado).");
  };

  const startEdit = (s) => {
    const d = new Date(s.datetime);
    setEdit({ id: s.id, date: d.toISOString().slice(0,10), time: d.toTimeString().slice(0,5), topic: s.topic || "" });
  };

  const saveEdit = () => {
    const iso = new Date(`${edit.date}T${edit.time}:00`).toISOString();
    setSessions(arr => arr.map(s => s.id === edit.id ? { ...s, datetime: iso, topic: edit.topic } : s));
    setEdit(null);
    notify("Asesoría actualizada.");
  };

  function notify(m){ setToast(m); setTimeout(()=>setToast(""),1800); }

  return (
    <section className="teacher-sessions">
      <div className="toolbar">
        <input placeholder="Buscar por alumno, matrícula o tema…" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={range} onChange={e=>setRange(e.target.value)}>
          <option value="upcoming">Próximas</option>
          <option value="all">Todas</option>
        </select>
        <div className="spacer" />
      </div>

      {toast && <div className="toast">{toast}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>Fecha/Hora</th><th>Alumno</th><th>Matrícula</th><th>Tema</th><th>Estatus</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id}>
              <td>{fmt(s.datetime)}</td>
              <td>{s.studentName}</td>
              <td>{s.studentMatricula}</td>
              <td>{s.topic || <span className="muted">—</span>}</td>
              <td><span className={`badge ${s.status === "scheduled" ? "ok" : s.status === "done" ? "neutral" : "ko"}`}>{s.status}</span></td>
              <td className="row-actions">
                <button onClick={() => startEdit(s)}>Editar</button>
                <button onClick={() => cancel(s.id)}>Cancelar</button>
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan="6" style={{textAlign:"center",opacity:.7}}>Sin resultados</td></tr>}
        </tbody>
      </table>

      {edit && (
        <div className="modal">
          <div className="modal-card">
            <h3>Editar asesoría</h3>
            <div className="grid2">
              <label>Fecha
                <input type="date" value={edit.date} onChange={e=>setEdit({...edit, date:e.target.value})} />
              </label>
              <label>Hora
                <input type="time" value={edit.time} onChange={e=>setEdit({...edit, time:e.target.value})} />
              </label>
              <label style={{gridColumn:"1 / -1"}}>Tema
                <input value={edit.topic} onChange={e=>setEdit({...edit, topic:e.target.value})} />
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={()=>setEdit(null)}>Cancelar</button>
              <button className="primary" onClick={saveEdit}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function fmt(dt){ const d = new Date(dt); return d.toLocaleString([], {dateStyle:"medium", timeStyle:"short"}); }
