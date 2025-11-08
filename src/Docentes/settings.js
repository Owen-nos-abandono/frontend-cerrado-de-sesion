import React from "react";

export default function SettingsTab({ onLogout }) {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; }
  })();

  return (
    <section className="teacher-settings">
      <div className="card" style={{maxWidth:640}}>
        <h3>Mi cuenta</h3>
        <div className="grid2">
          <p><strong>Correo:</strong><br/>{user.email || "—"}</p>
          <p><strong>Rol:</strong><br/>{user.role || "Docente"}</p>
        </div>
        <div className="actions">
          <button className="primary" onClick={()=>alert("Las credenciales incorrectas ya muestran mensaje en Login.")}>Ver política de acceso</button>
          <button onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>
    </section>
  );
}
