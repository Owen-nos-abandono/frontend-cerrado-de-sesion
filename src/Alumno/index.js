import React, { useEffect, useState } from "react";
import "./Styles/index.css";

import DashboardTab from "./dashboard";
import ScheduleTab from "./schedule";
import SessionsTab from "./sessions";
import SettingsTab from "./settings";

import { listarAsesorias } from "../api/asesoriasApi";

function StudentModule({ onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [sessions, setSessions] = useState([]);

  // 🔹 Cargar asesorías reales desde backend
  useEffect(() => {
    listarAsesorias()
      .then(data => setSessions(data))
      .catch(err => console.error("Error al cargar asesorías:", err));
  }, []);

  return (
    <div className="student-shell">
      <header className="student-header">
        <h1>Panel del Alumno</h1>
        <nav className="tabs">
          <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>Dashboard</button>
          <button className={tab === "schedule" ? "active" : ""} onClick={() => setTab("schedule")}>Agendar</button>
          <button className={tab === "sessions" ? "active" : ""} onClick={() => setTab("sessions")}>Mis asesorías</button>
          <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>Ajustes</button>
        </nav>
      </header>

      <main className="student-main">
        {tab === "dashboard" && <DashboardTab sessions={sessions} />}
        {tab === "schedule" && <ScheduleTab sessions={sessions} setSessions={setSessions} />}
        {tab === "sessions" && <SessionsTab sessions={sessions} setSessions={setSessions} />}
        {tab === "settings" && <SettingsTab onLogout={onLogout} />}
      </main>
    </div>
  );
}

export default StudentModule;
