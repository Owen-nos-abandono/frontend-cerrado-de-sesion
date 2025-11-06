import React from "react";
import "./Styles/settings.css";

export default function SettingsTab({ onLogout }) {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; }
  })();

  return (
    <section className="student-settings">
      <div className="card">
        <h3>Mi cuenta</h3>
        <div className="grid2">
          <p><strong>Correo:</strong><br/>{user.email || "—"}</p>
          <p><strong>Rol:</strong><br/>{user.role || "Usuario"}</p>
        </div>
        <div className="actions">
          <button className="danger" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>
    </section>
  );
}
