import React, { useMemo, useState } from "react";
import "./Styles/reports.css";

export default function ReportsTab({ professors, sessions }) {
  const [profId, setProfId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      const okP = profId ? s.professorId === profId : true;
      const t = new Date(s.datetime);
      const okFrom = from ? t >= new Date(from) : true;
      const okTo = to ? t <= new Date(endOfDay(to)) : true;
      return okP && okFrom && okTo;
    });
  }, [sessions, profId, from, to]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const done = filtered.filter(x => x.status === "done").length;
    const scheduled = filtered.filter(x => x.status === "scheduled").length;
    const canceled = filtered.filter(x => x.status === "canceled").length;

    const byArea = countBy(filtered.filter(x => x.status !== "canceled"), "area");
    const topArea = topKey(byArea);

    return { total, done, scheduled, canceled, topArea };
  }, [filtered]);

  const printReport = () => {
    const html = document.getElementById("coord-report-print")?.innerHTML || "";
    const w = window.open("", "PRINT", "height=800,width=900");
    w.document.write(`<html><head><title>Reporte</title><style>${printStyles()}</style></head><body>${html}</body></html>`);
    w.document.close(); w.focus(); w.print(); w.close();
  };

  return (
    <section className="coord-reports">
      <div className="toolbar">
        <select value={profId} onChange={e=>setProfId(e.target.value)}>
          <option value="">Todos los profesores</option>
          {professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        <input type="date" value={to} onChange={e=>setTo(e.target.value)} />
        <div className="spacer" />
        <button onClick={printReport}>Imprimir / PDF</button>
      </div>

      <div id="coord-report-print">
        <div className="cards">
          <div className="card stat"><span className="label">Total</span><span className="value">{kpis.total}</span></div>
          <div className="card stat"><span className="label">Realizadas</span><span className="value">{kpis.done}</span></div>
          <div className="card stat"><span className="label">Programadas</span><span className="value">{kpis.scheduled}</span></div>
          <div className="card stat"><span className="label">Canceladas</span><span className="value">{kpis.canceled}</span></div>
          <div className="card stat wide"><span className="label">Área más atendida</span><span className="value">{kpis.topArea || "—"}</span></div>
        </div>

        <table className="table">
          <thead>
            <tr><th>Fecha/Hora</th><th>Profesor</th><th>Alumno</th><th>Área</th><th>Estatus</th></tr>
          </thead>
          <tbody>
            {filtered
              .slice()
              .sort((a,b) => new Date(b.datetime) - new Date(a.datetime))
              .map(x => (
                <tr key={x.id}>
                  <td>{fmt(x.datetime)}</td>
                  <td>{nameOf(professors, x.professorId)}</td>
                  <td>{x.student}</td>
                  <td>{x.area}</td>
                  <td><span className={`badge ${badgeOf(x.status)}`}>{x.status}</span></td>
                </tr>
              ))}
            {filtered.length === 0 && <tr><td colSpan="5" style={{textAlign:"center",opacity:.7}}>Sin datos para el criterio.</td></tr>}
          </tbody>
        </table>
      </div>

      <p className="hint">
        <strong>HU-003:</strong> Reporte por profesor con filtros de fecha. El PDF usa impresión del navegador.
      </p>
    </section>
  );
}

function countBy(arr, key){ return arr.reduce((m,x)=>((m[x[key]]=(m[x[key]]||0)+1),m),{}); }
function topKey(obj){ let max=0, k=null; for(const key in obj){ if(obj[key]>max){max=obj[key]; k=key;} } return k; }
function nameOf(profs, id){ return profs.find(p=>p.id===id)?.name || "—"; }
function badgeOf(status){ return status==="done"?"ok":status==="scheduled"?"neutral":"ko"; }
function endOfDay(dateStr){ return dateStr+"T23:59:59"; }
function fmt(dt){ const d=new Date(dt); return d.toLocaleString([], {dateStyle:"medium", timeStyle:"short"}); }
function printStyles(){
  return `
    body{font-family:Arial,sans-serif;padding:16px}
    .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:10px}
    .card{border:1px solid #e6ecf2;border-radius:10px;padding:10px}
    .stat .label{font-size:12px;color:#64748b}
    .stat .value{font-size:22px;font-weight:700}
    table{width:100%;border-collapse:collapse}
    th,td{border:1px solid #e5e7eb;padding:8px;font-size:12px;text-align:left}
    th{background:#f5f7fa}
  `;
}
