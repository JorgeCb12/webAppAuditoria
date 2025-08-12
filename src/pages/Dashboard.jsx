import React, { useMemo, useState } from "react";
import KanbanControlled from "../components/KanbanControlled";
import Report from "../components/Report";

const estadosColor = {
  pendiente: "#fbbf24",
  "en ejecución": "#3b82f6",
  completada: "#22c55e",
};

const Dashboard = () => {
  const [tareas, setTareas] = useState([]);
  const [vista, setVista] = useState("jefe"); // jefe | operativo
  const [nuevaTarea, setNuevaTarea] = useState({ nombre: "", estado: "pendiente", puntos: "" });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNuevaTarea(prev => ({ ...prev, [name]: value }));
  };

  const handleAgregarTarea = e => {
    e.preventDefault();
    if (!nuevaTarea.nombre.trim() || !nuevaTarea.puntos || isNaN(nuevaTarea.puntos)) return;
    setTareas(prev => [
      ...prev,
      {
        id: Date.now(),
        nombre: nuevaTarea.nombre,
        estado: nuevaTarea.estado,
        puntos: parseInt(nuevaTarea.puntos, 10)
      }
    ]);
    setNuevaTarea({ nombre: "", estado: "pendiente", puntos: "" });
  };

  // Calcular progreso total
  const progreso = useMemo(() => {
    const total = tareas.reduce((sum, t) => sum + t.puntos, 0);
    const completados = tareas.filter(t => t.estado === "completada").reduce((sum, t) => sum + t.puntos, 0);
    return total === 0 ? 0 : Math.round((completados / total) * 100);
  }, [tareas]);

  return (
    <div>
      <div style={{maxWidth: 900, margin: '0 auto', padding: '32px 16px', fontFamily: 'Inter, Arial, sans-serif'}}>
        <h1 style={{textAlign: 'center', fontSize: 36, fontWeight: 800, color: '#2563eb', marginBottom: 8, letterSpacing: 1}}>Dashboard de Sprint</h1>
        <p style={{textAlign: 'center', fontSize: 18, color: '#64748b', marginBottom: 22}}>Visualiza, agrega y gestiona tareas fácilmente</p>
        <Report tareas={tareas} progreso={progreso} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, margin: '32px 0' }}>
        <button
          onClick={() => setVista("jefe")}
          style={{
            padding: "8px 24px",
            borderRadius: 6,
            border: vista === "jefe" ? "2px solid #22c55e" : "1px solid #ddd",
            background: vista === "jefe" ? "#f0fdf4" : "#fff",
            fontWeight: vista === "jefe" ? "bold" : "normal",
            color: vista === "jefe" ? "#22c55e" : "#000",
            cursor: "pointer"
          }}
        >
          Vista Jefe
        </button>
        <button
          onClick={() => setVista("operativo")}
          style={{
            padding: "8px 24px",
            borderRadius: 6,
            border: vista === "operativo" ? "2px solid #3b82f6" : "1px solid #ddd",
            background: vista === "operativo" ? "#f0f9ff" : "#fff",
            fontWeight: vista === "operativo" ? "bold" : "normal",
            color: vista === "operativo" ? "#3b82f6" : "#000",
            cursor: "pointer"
          }}
        >
          Vista Operativo
        </button>
      </div>
      {vista === "jefe" && (
        <>
          <form onSubmit={handleAgregarTarea} style={{
            display: "flex",
            gap: 18,
            margin: "32px 0 36px 0",
            justifyContent: "center",
            background: "#f1f5f9",
            padding: 24,
            borderRadius: 14,
            boxShadow: "0 2px 12px #2563eb11"
          }}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre de la tarea"
              value={nuevaTarea.nombre}
              onChange={handleInputChange}
              required
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "1.5px solid #cbd5e1",
                fontSize: 17,
                outline: "none",
                background: "#fff",
                minWidth: 160,
                boxShadow: "0 1px 4px #0001"
              }}
            />
            <select
              name="estado"
              value={nuevaTarea.estado}
              onChange={handleInputChange}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "1.5px solid #cbd5e1",
                fontSize: 17,
                outline: "none",
                background: "#fff",
                minWidth: 140,
                boxShadow: "0 1px 4px #0001"
              }}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en ejecución">En ejecución</option>
              <option value="completada">Completada</option>
            </select>
            <input
              type="number"
              name="puntos"
              placeholder="Puntos"
              value={nuevaTarea.puntos}
              onChange={handleInputChange}
              required
              min="1"
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "1.5px solid #cbd5e1",
                fontSize: 17,
                outline: "none",
                background: "#fff",
                width: 90,
                boxShadow: "0 1px 4px #0001"
              }}
            />
            <button type="submit" style={{
              padding: "10px 28px",
              borderRadius: 8,
              background: "linear-gradient(90deg, #22c55e 0%, #2563eb 100%)",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: 1,
              boxShadow: "0 2px 8px #22c55e22",
              cursor: "pointer",
              transition: "background .2s"
            }}>
              + Agregar tarea
            </button>
          </form>
          <div style={{
            maxWidth: 540,
            margin: "40px auto",
            padding: 32,
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 4px 18px #2563eb22"
          }}>
            <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, color: "#2563eb", letterSpacing: 1, marginBottom: 18 }}>Dashboard - Sprint actual</h2>
            <div style={{ margin: "24px 0 28px 0" }}>
              <strong style={{fontSize: 17}}>Progreso del sprint:</strong>
              <div style={{ background: "#e0e7ff", borderRadius: 12, height: 22, marginTop: 7, overflow: "hidden", boxShadow: "0 1px 6px #2563eb11" }}>
                <div style={{ width: progreso + "%", background: "linear-gradient(90deg, #22c55e 0%, #2563eb 100%)", height: "100%", borderRadius: 12, transition: "width .4s" }} />
              </div>
              <div style={{ textAlign: "right", fontSize: 16, marginTop: 3, color: '#2563eb', fontWeight: 700 }}>{progreso}% completado</div>
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {tareas.map(tarea => (
                <li key={tarea.id} style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                  padding: "16px 20px",
                  border: "1.5px solid #e0e7ff",
                  borderRadius: 12,
                  background: "#f8fafc",
                  boxShadow: "0 1px 8px #2563eb11"
                }}>
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 18 }}>{tarea.nombre}</span>
                  <span style={{ marginRight: 18, color: estadosColor[tarea.estado], fontWeight: "bold", fontSize: 15 }}>{tarea.estado}</span>
                  <span style={{ background: "#f3f4f6", borderRadius: 8, padding: "4px 14px", fontSize: 15, fontWeight: 600 }}>{tarea.puntos} pts</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {vista === "operativo" && (
        <div style={{marginTop: 40}}>
          <h2 style={{ textAlign: "center", marginBottom: 16 }}>Tablero Kanban</h2>
          <KanbanControlled tareas={tareas} setTareas={setTareas} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
