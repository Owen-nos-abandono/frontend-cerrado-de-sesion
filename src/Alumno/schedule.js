import React, { useState, useMemo } from "react";
import { agendarAsesoria } from "../api/asesoriasApi";
import "./Styles/schedule.css";

const genId = () => crypto.randomUUID?.() ?? String(Math.random());

function daySlots(dateStr) {
  const out = [];
  for (let h = 9; h <= 18; h++) {
    const d = new Date(dateStr + "T00:00:00");
    d.setHours(h, 0, 0, 0);
    out.push(d);
  }
  return out;
}

export default function ScheduleTab({ sessions, setSessions }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("");
  const [teacher, setTeacher] = useState("");
  const [msg, setMsg] = useState("");

  const available = useMemo(() => {
    if (!date) return [];
    const chosenDay = daySlots(date);
    const taken = new Set(
      sessions
        .filter(s => s.fecha === date)
        .map(s => `${s.fecha}T${s.hora}`)
    );
    const now = new Date();
    return chosenDay.filter(d => d > now && !taken.has(d.toISOString()));
  }, [date, sessions]);

  async function save() {
    setMsg("");
    if (!date || !time) {
      return setMsg("Selecciona fecha y hora disponibles.");
    }

    const payload = {
      fecha: date,
      hora: time,
      tema: topic.trim(),
      docente: teacher.trim() || "Por asignar"
    };

    try {
      const nueva = await agendarAsesoria(payload);
      setSessions(arr => [nueva, ...arr]);
      setMsg("¡Asesoría agendada!");
      setDate(""); setTime(""); setTopic(""); setTeacher("");
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      console.error(err);
      setMsg("Error al agendar asesoría");
    }
  }

  return (
    <section className="schedule">
      <div className="card">
        <h3>Agendar nueva asesoría</h3>

        <div className="grid2">
          <label>Fecha
            <input type="date" value={date} onChange={e => setDate(e.target.value)} min={today()} />
          </label>

          <label>Hora disponible
            <select value={time} onChange={e => setTime(e.target.value)} disabled={!date}>
              <option value="">{date ? "Selecciona…" : "Elige fecha primero"}</option>
              {available.map(d => {
                const hh = d.toTimeString().slice(0, 5);
                return <option key={hh} value={hh}>{hh}</option>;
              })}
            </select>
          </label>

          <label>Tema (opcional)
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Ej. Álgebra, proyecto, etc." />
          </label>

          <label>Docente (opcional)
            <input value={teacher} onChange={e => setTeacher(e.target.value)} placeholder="Si ya conoces el nombre" />
          </label>
        </div>

        {msg && <div className="toast">{msg}</div>}

        <div className="actions">
          <button className="primary" onClick={save}>Agendar</button>
        </div>
      </div>
    </section>
  );
}

function today() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
