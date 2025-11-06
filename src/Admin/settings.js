import React, { useState } from "react";
import "../Admin/Styles/settings.css";

export default function SettingsTab() {
  const [emailRegex, setEmailRegex] = useState("^[a-z0-9._%+-]+@tuinstitucion\\.edu\\.mx$");
  const [minLength, setMinLength] = useState(8);
  const [requireLetter, setRequireLetter] = useState(true);
  const [requireNumber, setRequireNumber] = useState(true);
  const [toast, setToast] = useState("");

  const save = () => {
    // solo front: persistimos en localStorage para demo
    const payload = { emailRegex, minLength, requireLetter, requireNumber };
    localStorage.setItem("policies", JSON.stringify(payload));
    setToast("Políticas guardadas (localStorage).");
    setTimeout(()=>setToast(""),1800);
  };

  return (
    <section className="settings">
      <h3>Políticas de Seguridad</h3>
      <div className="grid2">
        <label>Regex correo institucional
          <input value={emailRegex} onChange={e=>setEmailRegex(e.target.value)} />
          <small>Ej.: <code>^[a-z0-9._%+-]+@tuinstitucion\.edu\.mx$</code></small>
        </label>
        <label>Mínimo de caracteres (password)
          <input type="number" min={6} max={48} value={minLength} onChange={e=>setMinLength(parseInt(e.target.value||"8",10))} />
        </label>
        <label className="switch">Requiere letra
          <input type="checkbox" checked={requireLetter} onChange={e=>setRequireLetter(e.target.checked)} />
        </label>
        <label className="switch">Requiere número
          <input type="checkbox" checked={requireNumber} onChange={e=>setRequireNumber(e.target.checked)} />
        </label>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <div className="modal-actions">
        <button className="primary" onClick={save}>Guardar</button>
      </div>
    </section>
  );
}
