import React, { useMemo, useState } from "react";
import "./Styles/assign.css";

const genId = () => crypto.randomUUID?.() ?? String(Math.random());

// slots 9:00–18:00
function daySlots(dateStr) {
  const out = [];
  for (let h = 9; h <= 18; h++) { const d = new Date(dateStr + "T00:00:00"); d.setHours(h,0,0,0); out.push(d); }
  return out;
}

export default function AssignTab({ students, sessions, setSessions }) {
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("");
  const [msg, setMsg] = useState("");

  const available = useMemo(() => {
    if (!date) return [];
    const taken = new Set(
      sessions.filter(s => s.datetime.startsWith(date)).map(s => new Date(s.datetime).toISOString())
    );
    const now = new Date();
    return daySlots(date).filter(d => d > now && !taken.has(d.toISOString()));
  }, [date, sessions]);

  const save = () => {
    setMsg("");
    if (!studentId || !date || !time) return setMsg("Selecciona alumno, fecha y hora.");
    const dtIso = new Date(`${date}T${time}:00`).toISOString();
    if (sessions.some(s => s.datetime === dtIso)) return setMsg("Ese horario ya está ocupado.");

    const stu = students.find(x => x.id === studentId);
    const payload = {
      id: genId(),
      studentId,
      studentName: stu?.name || "Alumno",
      studentMatricula: stu?.matricula || "",
      datetime: dtIso,
      topic: topic.trim(),
      status: "scheduled",
      feedback: "",
    };
    setSessions(arr => [payload, ...arr]);
    setMsg("Asesoría asignada.");
    setStudentId(""); setDate(""); setTime(""); setTopic("");
    setTimeout(()=>setMsg(""),1800);
  };

  return (
    <section className="assign">
      <div className="card">
        <h3>Registrar asesoría para estudiante</h3>
        <div className="grid2">
          <label>Alumno
            <select value={studentId} onChange={e=>setStudentId(e.target.value)}>
              <option value="">Selecciona…</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} — {s.matricula}</option>)}
            </select>
          </label>
          <label>Fecha
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} min={today()} />
          </label>
          <label>Hora disponible
            <select value={time} onChange={e=>setTime(e.target.value)} disabled={!date}>
              <option value="">{date ? "Selecciona…" : "Elige fecha primero"}</option>
              {available.map(d => {
                const hh = d.toTimeString().slice(0,5);
                return <option key={hh} value={hh}>{hh}</option>;
              })}
            </select>
            <small className="muted">* Verás solo horarios libres y futuros.</small>
          </label>
          <label>Tema (opcional)
            <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Ej. Álgebra, proyecto, etc." />
          </label>
        </div>

        {msg && <div className="toast">{msg}</div>}
        <div className="actions">
          <button className="primary" onClick={save}>Asignar</button>
        </div>
      </div>
    </section>
  );
}

function today(){ const d=new Date(); return d.toISOString().slice(0,10); }
