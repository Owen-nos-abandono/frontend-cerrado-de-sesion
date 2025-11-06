import React, { useState } from "react";
import "./Styles/sessions.css";
import { eliminarAsesoria } from "../api/asesoriasApi";

export default function SessionsTab({ sessions, setSessions }) {
  const [msg, setMsg] = useState("");

  async function cancelar(id) {
    try {
      // Si tu backend aún no tiene DELETE, solo elimina localmente:
      setSessions(arr => arr.filter(s => s.id !== id));
      setMsg("Asesoría cancelada con éxito.");

      // Si luego agregas DELETE en Spring Boot:
      // await eliminarAsesoria(id);

      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      console.error(err);
      setMsg("Error al cancelar la asesoría.");
    }
  }

  if (!sessions || sessions.length === 0) {
    return (
      <section className="student-sessions">
        <div className="card">
          <h3>Mis asesorías</h3>
          <p>No tienes asesorías registradas aún.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="student-sessions">
      <div className="card">
        <h3>Mis asesorías agendadas</h3>

        {msg && <div className="toast">{msg}</div>}

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Tema</th>
              <th>Docente</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id}>
                <td>{s.fecha}</td>
                <td>{s.hora}</td>
                <td>{s.tema}</td>
                <td>{s.docente}</td>
                <td>
                  <button
                    className="danger"
                    onClick={() => cancelar(s.id)}
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
