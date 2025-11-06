import React, { useState } from "react";
import "./Styles/index.css";

import UsersTab from "./users";
import RolesTab from "./roles";
import LogsTab from "./logs";
import SettingsTab from "./settings";

export default function AdminModule() {
  const [tab, setTab] = useState("users");

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <h1>Módulo de Administración</h1>
        <nav className="tabs">
          <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>Users</button>
          <button className={tab === "roles" ? "active" : ""} onClick={() => setTab("roles")}>Roles</button>
          <button className={tab === "logs" ? "active" : ""} onClick={() => setTab("logs")}>Logs</button>
          <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>Settings</button>
        </nav>
      </header>

      <main className="admin-main">
        {tab === "users" && <UsersTab />}
        {tab === "roles" && <RolesTab />}
        {tab === "logs" && <LogsTab />}
        {tab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}
