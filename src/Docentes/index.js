import React, { useEffect, useMemo, useState } from "react";
import "./Styles/index.css";

import StudentsTab from "./students";
import AssignTab from "./assign";
import SessionsTab from "./sessions";
import HistoryTab from "./history";
import SettingsTab from "./settings";

export default function TeacherModule({ onLogout }) {
  // Mocks con persistencia simple
  const [students, setStudents] = useState(() => {
    try {
      const raw = localStorage.getItem("teacherStudents");
      return raw ? JSON.parse(raw) : [
        { id: "s1", name: "Brenda López", matricula: "A0123456", carrera: "ISC" },
        { id: "s2", name: "Kevin Torres", matricula: "A0765432", carrera: "IGE" },
        { id: "s3", name: "Cristina Pérez", matricula: "A0987612", carrera: "LAE" },
        { id: "s4", name: "Mauricio Díaz", matricula: "A0555123", carrera: "ARQ" },
      ];
    } catch { return []; }
  });

  const [sessions, setSessions] = useState(() => {
    try {
      const raw = localStorage.getItem("teacherSessions");
      return raw ? JSON.parse(raw) : [
        { id: "c1", studentId: "s1", studentName: "Brenda López", studentMatricula: "A0123456", datetime: futureIso(1, 10), topic: "Cálculo diferencial", status: "scheduled", feedback: "" },
        { id: "c2", studentId: "s2", studentName: "Kevin Torres", studentMatricula: "A0765432", datetime: pastIso(2, 14), topic: "Proyecto base de datos", status: "done", feedback: "Buen avance, revisar normalización." },
      ];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("teacherStudents", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("teacherSessions", JSON.stringify(sessions));
  }, [sessions]);

  const [tab, setTab] = useState("students");

  // util: mapa id->alumno
  const studentMap = useMemo(() => {
    const m = new Map();
    students.forEach(s => m.set(s.id, s));
    return m;
  }, [students]);

  return (
    <div className="teacher-shell">
      <header className="teacher-header">
        <h1>Módulo de Profesor</h1>
        <nav className="tabs">
          <button className={tab === "students" ? "active" : ""} onClick={() => setTab("students")}>Estudiantes</button>
          <button className={tab === "assign" ? "active" : ""} onClick={() => setTab("assign")}>Asignar asesoría</button>
          <button className={tab === "sessions" ? "active" : ""} onClick={() => setTab("sessions")}>Mis asesorías</button>
          <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>Historial</button>
          <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>Ajustes</button>
        </nav>
      </header>

      <main className="teacher-main">
        {tab === "students" && (
          <StudentsTab students={students} setStudents={setStudents} />
        )}

        {tab === "assign" && (
          <AssignTab
            students={students}
            sessions={sessions}
            setSessions={setSessions}
          />
        )}

        {tab === "sessions" && (
          <SessionsTab
            sessions={sessions}
            setSessions={setSessions}
            students={students}
          />
        )}

        {tab === "history" && (
          <HistoryTab
            sessions={sessions}
            setSessions={setSessions}
            studentMap={studentMap}
          />
        )}

        {tab === "settings" && <SettingsTab onLogout={onLogout} />}
      </main>
    </div>
  );
}

// ---- helpers tiempo
function futureIso(days = 0, hour = 9) {
  const d = new Date(); d.setDate(d.getDate() + days); d.setHours(hour, 0, 0, 0); return d.toISOString();
}
function pastIso(days = 0, hour = 9) {
  const d = new Date(); d.setDate(d.getDate() - days); d.setHours(hour, 0, 0, 0); return d.toISOString();
}
