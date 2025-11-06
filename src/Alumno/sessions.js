import React, { useMemo, useState } from "react";
import "./Styles/sessions.css";

export default function SessionsTab({ sessions, setSessions }) {
  const [q, setQ] = useState("");
  const [range, setRange] = useState("all"); // all | upcoming | past
  const [edit, setEdit] = useState(null); // {id, date, time}
  const [toast, setToast] = useState("");

  const list = useMemo(() => {
    const now = new Date();
    return sessions
      .filter(s => (q ? (s.topic?.toLowerCase().includes(q.toLowerCase()) || s.teacher?.toLowerCase().includes(q.toLowerCase())) : true))
      .filter(s => {
        const when = new Date(s.datetime);
        if (range === "upcoming") return when >= now;
        if (range === "past") return when < now;
        return true;
      })
      .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
  }, [sessions, q, range]);

  const cancel = (id) => {
    setSessions(arr => arr.filter(s => s.id !== id));
    show("Asesoría cancelada.");
  };

  const startEdit = (s) => {
    const d = new Date(s.datetime);
    setEdit({ id: s.id, date: d.toISOString().slice(0,10), time: d.toTimeString().slice(0,5) });
  };

  const saveEdit = () => {
    const iso = new Date(`${edit.date}T${edit.time}:00`).toISOString();
    setSessions(arr => arr.map(s => s.id === edit.id ? { ...s, datetime: iso } : s));
    setEdit(null);
    show("Horario actualizado.");
  };

  function show(m) { setToast(m); setTimeout(()=>setToast(""),1800); }

  return (
    <section className="sessions">
      <div className="toolbar">
        <input placeholder="Buscar por tema o docente…" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={range} onChange={e=>setRange(e.target.value)}>
          <option value="all">Todas</option>
          <option value="upcoming">Próximas</option>
          <option value="past">Pasadas</option>
        </select>
        <div className="spacer" />
      </div>

      {toast && <div className="toast">{toast}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>Fecha/Hora</th><th>Tema</th><th>Docente</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id}>
              <td>{fmt(s.datetime)}</td>
              <td>{s.topic || <span className="muted">—</span>}</td>
              <td>{s.teacher || "Por asignar"}</td>
              <td className="row-actions">
                <button onClick={() => startEdit(s)}>Reprogramar</button>
                <button onClick={() => cancel(s.id)}>Cancelar</button>
              </td>
            </tr>
          ))}
          {list.length === 0 && (
            <tr><td colSpan="4" style={{textAlign:"center",opacity:.7}}>Sin resultados</td></tr>
          )}
        </tbody>
      </table>

      {edit && (
        <div className="modal">
          <div className="modal-card">
            <h3>Reprogramar asesoría</h3>
            <div className="grid2">
              <label>Fecha
                <input type="date" value={edit.date} onChange={e=>setEdit({...edit, date:e.target.value})} />
              </label>
              <label>Hora
                <input type="time" value={edit.time} onChange={e=>setEdit({...edit, time:e.target.value})} />
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

function fmt(dt){
  const d = new Date(dt);
  return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}
