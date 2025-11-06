import React, { useMemo, useState } from "react";
import "../Admin/Styles/users.css";

const ROLES = ["Administrador", "Usuario", "Docente", "Coordinador"];

const randomId = () => crypto.randomUUID?.() ?? String(Math.random());
const randomTempPass = () => {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
  return Array.from({ length: 8 }, () => c[Math.floor(Math.random() * c.length)]).join("");
};

const initialUsers = [
  { id: randomId(), fullName: "Ana Admin", email: "admin@example.com", role: "Administrador", isActive: true, mustChangePassword: false },
  { id: randomId(), fullName: "Ulises Usuario", email: "usuario@example.com", role: "Usuario", isActive: true, mustChangePassword: false },
  { id: randomId(), fullName: "Dora Docente", email: "docente@example.com", role: "Docente", isActive: true, mustChangePassword: false },
  { id: randomId(), fullName: "Coco Coordinador", email: "coordinador@example.com", role: "Coordinador", isActive: false, mustChangePassword: false },
];

export default function UsersTab() {
  const [users, setUsers] = useState(initialUsers);
  const [q, setQ] = useState("");
  const [roleF, setRoleF] = useState("");
  const [statusF, setStatusF] = useState("");
  const [modal, setModal] = useState(null); // null | {mode:'create'|'edit', data?}
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    return users.filter(u => {
      const okQ = q ? (u.fullName.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())) : true;
      const okR = roleF ? u.role === roleF : true;
      const okS = statusF ? (statusF === "activo" ? u.isActive : !u.isActive) : true;
      return okQ && okR && okS;
    });
  }, [users, q, roleF, statusF]);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2000); };

  const save = (payload) => {
    // Validaciones básicas
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
    if (!payload.fullName.trim()) return showToast("Nombre requerido.");
    if (!emailOk) return showToast("Email inválido.");
    if (!ROLES.includes(payload.role)) return showToast("Rol inválido.");

    if (modal?.mode === "edit" && modal.data) {
      setUsers(us => us.map(x => x.id === modal.data.id ? { ...x, ...payload } : x));
      showToast("Usuario actualizado.");
    } else {
      setUsers(us => [{ id: randomId(), mustChangePassword: false, ...payload }, ...us]);
      showToast("Usuario creado.");
    }
    setModal(null);
  };

  const toggle = (u) => {
    setUsers(us => us.map(x => x.id === u.id ? { ...x, isActive: !x.isActive } : x));
  };

  const reset = (u) => {
    const temp = randomTempPass();
    setUsers(us => us.map(x => x.id === u.id ? { ...x, mustChangePassword: true } : x));
    showToast(`Temporal: ${temp}`);
  };

  const assignRoleInline = (u, role) => {
    setUsers(us => us.map(x => x.id === u.id ? { ...x, role } : x));
    showToast("Rol actualizado.");
  };

  const printList = () => {
    const html = document.getElementById("users-print")?.innerHTML || "";
    const w = window.open("", "PRINT", "height=800,width=900");
    w.document.write(`<html><head><title>Usuarios</title><style>
      body{font-family:Arial,sans-serif;padding:16px}
      table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px;font-size:12px}
      th{background:#f5f5f5;text-align:left}
    </style></head><body>${html}</body></html>`);
    w.document.close(); w.focus(); w.print(); w.close();
  };

  return (
    <section>
      <div className="toolbar">
        <input placeholder="Buscar nombre o email…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={roleF} onChange={(e) => setRoleF(e.target.value)}>
          <option value="">Todos los roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)}>
          <option value="">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
        <div className="spacer" />
        <button onClick={printList}>Exportar PDF</button>
        <button className="primary" onClick={() => setModal({ mode: "create" })}>Crear usuario</button>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <div id="users-print">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Must change</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={e => assignRoleInline(u, e.target.value)}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td><span className={`badge ${u.isActive ? "ok" : "ko"}`}>{u.isActive ? "Activo" : "Inactivo"}</span></td>
                <td>{u.mustChangePassword ? "Sí" : "No"}</td>
                <td className="row-actions">
                  <button onClick={() => setModal({ mode: "edit", data: u })}>Editar</button>
                  <button onClick={() => reset(u)}>Reset pass</button>
                  <button onClick={() => toggle(u)}>{u.isActive ? "Desactivar" : "Activar"}</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="6" style={{textAlign:"center",opacity:.7}}>Sin resultados</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && <UserModal onClose={() => setModal(null)} onSave={save} data={modal.data} />}
    </section>
  );
}

function UserModal({ onClose, onSave, data }) {
  const [fullName, setFullName] = useState(data?.fullName || "");
  const [email, setEmail] = useState(data?.email || "");
  const [role, setRole] = useState(data?.role || "Usuario");
  const [isActive, setIsActive] = useState(data?.isActive ?? true);

  return (
    <div className="modal">
      <div className="modal-card">
        <h3>{data ? "Editar usuario" : "Crear usuario"}</h3>
        <div className="grid2">
          <label>Nombre
            <input value={fullName} onChange={e => setFullName(e.target.value)} />
          </label>
          <label>Email
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          <label>Rol
            <select value={role} onChange={e => setRole(e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label className="switch">Activo
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
          </label>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button className="primary" onClick={() => onSave({ fullName, email, role, isActive })}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
