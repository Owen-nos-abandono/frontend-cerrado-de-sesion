import React, { useMemo, useState } from "react";
import "../Admin/Styles/logs.css";

const initialLogs = [
  { id: "a1", email: "admin@example.com", event: "LOGIN_SUCCESS", at: "2025-11-01 09:10", ip: "10.0.0.5", ua: "Chrome" },
  { id: "a2", email: "usuario@example.com", event: "LOGIN_FAILURE", at: "2025-11-01 10:22", ip: "10.0.0.7", ua: "Chrome" },
  { id: "a3", email: "docente@example.com", event: "RESET_PASSWORD", at: "2025-11-02 08:05", ip: "10.0.0.8", ua: "Edge" },
];

export default function LogsTab() {
  const [logs] = useState(initialLogs);
  const [q, setQ] = useState("");
  const [eventF, setEventF] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return logs.filter(l => {
      const okQ = q ? l.email.toLowerCase().includes(q.toLowerCase()) : true;
      const okE = eventF ? l.event === eventF : true;
      const t = new Date(l.at.replace(" ", "T"));
      const okFrom = from ? t >= new Date(from) : true;
      const okTo = to ? t <= new Date(to) : true;
      return okQ && okE && okFrom && okTo;
    });
  }, [logs, q, eventF, from, to]);

  const printList = () => {
    const html = document.getElementById("logs-print")?.innerHTML || "";
    const w = window.open("", "PRINT", "height=800,width=900");
    w.document.write(`<html><head><title>Logs</title><style>
      body{font-family:Arial,sans-serif;padding:16px}
      table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px;font-size:12px}
      th{background:#f5f5f5;text-align:left}
    </style></head><body>${html}</body></html>`);
    w.document.close(); w.focus(); w.print(); w.close();
  };

  const uniqueEvents = Array.from(new Set(logs.map(l => l.event)));

  return (
    <section>
      <div className="toolbar">
        <input placeholder="Buscar por email…" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={eventF} onChange={e=>setEventF(e.target.value)}>
          <option value="">Todos los eventos</option>
          {uniqueEvents.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        <input type="date" value={to} onChange={e=>setTo(e.target.value)} />
        <div className="spacer" />
        <button onClick={printList}>Exportar PDF</button>
      </div>

      <div id="logs-print">
        <table className="table">
          <thead>
            <tr>
              <th>Email</th><th>Evento</th><th>Fecha/Hora</th><th>IP</th><th>User Agent</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id}>
                <td>{l.email}</td>
                <td>{l.event}</td>
                <td>{l.at}</td>
                <td>{l.ip}</td>
                <td>{l.ua}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="5" style={{textAlign:"center",opacity:.7}}>Sin resultados</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
