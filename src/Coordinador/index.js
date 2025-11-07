import React, { useEffect, useState } from "react";
import "./Styles/index.css";

import ProfessorsTab from "./professors";
import AreasTab from "./areas";
import ReportsTab from "./reports";

export default function CoordinatorModule() {
  // Mocks con persistencia local
  const [professors, setProfessors] = useState(() => {
    try {
      const raw = localStorage.getItem("coordProfessors");
      return raw ? JSON.parse(raw) : [
        { id: "p1", name: "María Álvarez", email: "malvarez@institucion.edu", active: true, areas: ["Matemáticas", "Cálculo"] },
        { id: "p2", name: "Luis Romero", email: "lromero@institucion.edu", active: true, areas: ["Base de Datos"] },
        { id: "p3", name: "Elena García", email: "egarcia@institucion.edu", active: false, areas: ["Programación", "Algoritmos"] },
      ];
    } catch { return []; }
  });

  // Sesiones (para reportes) — en real vendría del backend
  const [sessions, setSessions] = useState(() => {
    try {
      const raw = localStorage.getItem("coordSessions");
      return raw ? JSON.parse(raw) : [
        // status: scheduled | done | canceled
        { id: "s1", professorId: "p1", student: "A0123456", area: "Cálculo",   datetime: pastIso(5, 10),  status: "done" },
        { id: "s2", professorId: "p1", student: "A0123456", area: "Cálculo",   datetime: pastIso(2, 12),  status: "done" },
        { id: "s3", professorId: "p2", student: "A0765432", area: "Base de Datos", datetime: pastIso(1, 11),  status: "done" },
        { id: "s4", professorId: "p2", student: "A0999999", area: "Base de Datos", datetime: futureIso(1, 9), status: "scheduled" },
        { id: "s5", professorId: "p3", student: "A0555123", area: "Programación",  datetime: pastIso(3, 16),  status: "canceled" },
      ];
    } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("coordProfessors", JSON.stringify(professors)); }, [professors]);
  useEffect(() => { localStorage.setItem("coordSessions", JSON.stringify(sessions)); }, [sessions]);

  const [tab, setTab] = useState("professors");

  return (
    <div className="coord-shell">
      <header className="coord-header">
        <h1>Módulo de Coordinación</h1>
        <nav className="tabs">
          <button className={tab === "professors" ? "active" : ""} onClick={() => setTab("professors")}>Profesores</button>
          <button className={tab === "areas" ? "active" : ""} onClick={() => setTab("areas")}>Áreas / Materias</button>
          <button className={tab === "reports" ? "active" : ""} onClick={() => setTab("reports")}>Reportes</button>
        </nav>
      </header>

      <main className="coord-main">
        {tab === "professors" && (
          <ProfessorsTab professors={professors} setProfessors={setProfessors} />
        )}
        {tab === "areas" && (
          <AreasTab professors={professors} setProfessors={setProfessors} />
        )}
        {tab === "reports" && (
          <ReportsTab professors={professors} sessions={sessions} />
        )}
      </main>
    </div>
  );
}

// helpers de tiempo
function futureIso(days = 0, hour = 9) {
  const d = new Date(); d.setDate(d.getDate() + days); d.setHours(hour, 0, 0, 0); return d.toISOString();
}
function pastIso(days = 0, hour = 9) {
  const d = new Date(); d.setDate(d.getDate() - days); d.setHours(hour, 0, 0, 0); return d.toISOString();
}
