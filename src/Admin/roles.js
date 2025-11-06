import React, { useState } from "react";
import "../Admin/Styles/roles.css";

const ROLES = ["Administrador", "Usuario", "Docente", "Coordinador"];
const PERMISOS = [
  "users.read", "users.create", "users.update", "users.toggle",
  "roles.assign", "logs.read", "password.reset"
];

const initialMatrix = {
  Administrador: [...PERMISOS],
  Usuario: [],
  Docente: [],
  Coordinador: []
};

export default function RolesTab() {
  const [matrix, setMatrix] = useState(initialMatrix);
  const [users] = useState([
    { id: "1", name: "Ana Admin", role: "Administrador" },
    { id: "2", name: "Ulises Usuario", role: "Usuario" },
    { id: "3", name: "Dora Docente", role: "Docente" },
  ]);
  const [selectedUser, setSelectedUser] = useState("");
  const [roleForUser, setRoleForUser] = useState("Usuario");
  const [toast, setToast] = useState("");

  const togglePerm = (role, perm) => {
    setMatrix(m => {
      const set = new Set(m[role]);
      set.has(perm) ? set.delete(perm) : set.add(perm);
      return { ...m, [role]: Array.from(set) };
    });
  };

  const assignRole = () => {
    if (!selectedUser) return setToast("Selecciona un usuario.");
    setToast(`Rol "${roleForUser}" asignado a ${users.find(u=>u.id===selectedUser)?.name || "usuario"}.`);
    setTimeout(()=>setToast(""),1800);
  };

  return (
    <section>
      <div className="toolbar">
        <strong>Asignar rol a usuario</strong>
        <select value={selectedUser} onChange={e=>setSelectedUser(e.target.value)}>
          <option value="">Selecciona usuario…</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select value={roleForUser} onChange={e=>setRoleForUser(e.target.value)}>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button className="primary" onClick={assignRole}>Aplicar</button>
        <div className="spacer" />
      </div>

      {toast && <div className="toast">{toast}</div>}

      <div className="role-matrix">
        <table className="table">
          <thead>
            <tr>
              <th>Rol \ Permiso</th>
              {PERMISOS.map(p => <th key={p}>{p}</th>)}
            </tr>
          </thead>
          <tbody>
            {ROLES.map(r => (
              <tr key={r}>
                <td><strong>{r}</strong></td>
                {PERMISOS.map(p => (
                  <td key={p} style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={matrix[r].includes(p)}
                      onChange={() => togglePerm(r, p)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
