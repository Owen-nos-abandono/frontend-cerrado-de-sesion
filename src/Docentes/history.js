import React, { useMemo, useState } from "react";
import "./Styles/history.css";

export default function HistoryTab({ sessions, setSessions, studentMap }) {
  const [q, setQ] = useState("");
  const [editFb, setEditFb] = useState(null); // {id, feedback}
  const [toast, setToast] = useState("");

  const list = useMemo(() => {
    return sessions
      .filter(s => new Date(s.datetime) < new Date()) // solo pasadas
      .filter(s => q ? (s.studentName.toLowerCase().includes(q.toLowerCase()) || s.studentMatricula.toLowerCase().includes(q.toLowerCase())) : true)
      .sort((a,b) => new Date(b.datetime) - new Date(a.datetime));
  }, [sessions, q]);

  const saveFeedback = () => {
    setSessions(arr => arr.map(s => s.id === editFb.id ? { ...s, status: "done", feedback: editFb.feedback } : s));
    setEditFb(null);
    setToast("Retroalimentación registrada.");
    setTimeout(()=>setToast(""),1600);
  };

  return (
    <section className="teacher-history">
      <div className="toolbar">
        <input placeholder="Buscar por alumno o matrícula…" value={q} onChange={e=>setQ(e.target.value)} />
        <div className="spacer" />
      </div>

      {toast && <div className="toast">{toast}</div>}

      <table className="table">
        <thead>
          <tr><th>Fecha/Hora</th><th>Alumno</th><th>Matrícula</th><th>Tema</th><th>Estatus</th><th>Feedback</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id}>
              <td>{fmt(s.datetime)}</td>
              <td>{s.studentName}</td>
              <td>{s.studentMatricula}</td>
              <td>{s.topic || <span className="muted">—</span>}</td>
              <td><span className={`badge ${s.status === "done" ? "ok" : "neutral"}`}>{s.status}</span></td>
              <td className="cell-note">{s.feedback ? s.feedback : <span className="muted">Sin observaciones</span>}</td>
              <td className="row-actions">
                <button onClick={() => setEditFb({ id: s.id, feedback: s.feedback || "" })}>Agregar/Editar</button>
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan="7" style={{textAlign:"center",opacity:.7}}>No hay asesorías realizadas.</td></tr>}
        </tbody>
      </table>

      {editFb && (
        <div className="modal">
          <div className="modal-card">
            <h3>Observaciones / Retroalimentación</h3>
            <textarea
              rows={6}
              value={editFb.feedback}
              onChange={e=>setEditFb({...editFb, feedback: e.target.value})}
              placeholder="Escribe comentarios, acuerdos y tareas de seguimiento…"
            />
            <div className="modal-actions">
              <button onClick={()=>setEditFb(null)}>Cancelar</button>
              <button className="primary" onClick={saveFeedback}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function fmt(dt){ const d=new Date(dt); return d.toLocaleString([], {dateStyle:"medium", timeStyle:"short"}); }
