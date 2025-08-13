import React, { useMemo, useState } from 'react'
import KanbanControlled from '../components/KanbanControlled'
import Report from '../components/Report'

const estadosColor = {
  pendiente: '#fbbf24',
  'en ejecución': '#3b82f6',
  completada: '#22c55e',
}

const Dashboard = () => {
  const [tareas, setTareas] = useState([])
  const [vista, setVista] = useState('jefe') // jefe | operativo
  const [nuevaTarea, setNuevaTarea] = useState({
    nombre: '',
    estado: 'pendiente',
    puntos: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNuevaTarea((prev) => ({ ...prev, [name]: value }))
  }

  const handleAgregarTarea = (e) => {
    e.preventDefault()
    if (
      !nuevaTarea.nombre.trim() ||
      !nuevaTarea.puntos ||
      isNaN(parseFloat(nuevaTarea.puntos.replace(',', '.')))
    )
      return
    setTareas((prev) => [
      ...prev,
      {
        id: Date.now(),
        nombre: nuevaTarea.nombre,
        estado: nuevaTarea.estado,
        puntos: parseFloat(nuevaTarea.puntos.replace(',', '.')),
      },
    ])
    setNuevaTarea({ nombre: '', estado: 'pendiente', puntos: '' })
  }

  // Calcular progreso total
  const progreso = useMemo(() => {
    const total = tareas.reduce((sum, t) => sum + t.puntos, 0)
    const completados = tareas
      .filter((t) => t.estado === 'completada')
      .reduce((sum, t) => sum + t.puntos, 0)
    return total === 0 ? 0 : Math.round((completados / total) * 100)
  }, [tareas])

  return (
    <div>
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '32px 16px',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            fontSize: 36,
            fontWeight: 800,
            color: '#2563eb',
            marginBottom: 8,
            letterSpacing: 1,
          }}
        >
          Dashboard de Sprint
        </h1>
        <p
          style={{
            textAlign: 'center',
            fontSize: 18,
            color: '#64748b',
            marginBottom: 22,
          }}
        >
          Visualiza, agrega y gestiona tareas fácilmente
        </p>
        <Report tareas={tareas} progreso={progreso} />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          margin: '32px 0',
        }}
      >
        <button
          onClick={() => setVista('jefe')}
          style={{
            padding: '8px 24px',
            borderRadius: 6,
            border: vista === 'jefe' ? '2px solid #22c55e' : '1px solid #ddd',
            background: vista === 'jefe' ? '#f0fdf4' : '#fff',
            fontWeight: vista === 'jefe' ? 'bold' : 'normal',
            color: vista === 'jefe' ? '#22c55e' : '#000',
            cursor: 'pointer',
          }}
        >
          Vista Jefe
        </button>
        <button
          onClick={() => setVista('operativo')}
          style={{
            padding: '8px 24px',
            borderRadius: 6,
            border:
              vista === 'operativo' ? '2px solid #3b82f6' : '1px solid #ddd',
            background: vista === 'operativo' ? '#f0f9ff' : '#fff',
            fontWeight: vista === 'operativo' ? 'bold' : 'normal',
            color: vista === 'operativo' ? '#3b82f6' : '#000',
            cursor: 'pointer',
          }}
        >
          Vista Operativo
        </button>
      </div>
      {vista === 'jefe' && (
        <>
          <form
            onSubmit={handleAgregarTarea}
            style={{
              display: 'flex',
              gap: 18,
              margin: '32px 0 36px 0',
              justifyContent: 'center',
              background: '#f1f5f9',
              padding: 24,
              borderRadius: 14,
              boxShadow: '0 2px 12px #2563eb11',
            }}
          >
            <input
              type="text"
              name="nombre"
              placeholder="Nombre de la tarea"
              value={nuevaTarea.nombre}
              onChange={handleInputChange}
              required
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: 17,
                outline: 'none',
                background: '#fff',
                minWidth: 160,
                boxShadow: '0 1px 4px #0001',
              }}
            />
            <select
              name="estado"
              value={nuevaTarea.estado}
              onChange={handleInputChange}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: 17,
                outline: 'none',
                background: '#fff',
                minWidth: 140,
                boxShadow: '0 1px 4px #0001',
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
              min={0.5}
              step={0.5}
              inputMode="decimal"
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: 17,
                outline: 'none',
                background: '#fff',
                width: 140,
                boxShadow: '0 1px 4px #0001',
              }}
            />

            <button
              type="submit"
              style={{
                padding: '10px 28px',
                borderRadius: 8,
                background: 'linear-gradient(90deg, #22c55e 0%, #2563eb 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: 1,
                boxShadow: '0 2px 8px #22c55e22',
                cursor: 'pointer',
                transition: 'background .2s',
              }}
            >
              + Agregar tarea
            </button>
          </form>
          <div
            style={{
              maxWidth: 600,
              margin: '40px auto',
              padding: 0,
              borderRadius: 24,
              boxShadow: '0 6px 32px #2563eb22',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)',
              overflow: 'hidden',
            }}
          >
            <div style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #22c55e 100%)',
              padding: '32px 24px 24px 24px',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}>
              <span style={{ position: 'absolute', left: 24, top: 32, fontSize: 28 }}>📊</span>
              <h2
                style={{
                  fontSize: 30,
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: 1,
                  marginBottom: 4,
                  textShadow: '0 2px 8px #0002',
                }}
              >
                Dashboard - Sprint actual
              </h2>
              <div style={{ color: '#e0e7ff', fontSize: 16, marginBottom: 14 }}>
                <b>{tareas.length}</b> tareas registradas
              </div>
              <div style={{ width: '100%', marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <strong style={{ color: '#fff', fontSize: 17, letterSpacing: 0.5 }}>Progreso del sprint</strong>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{progreso}%</span>
                </div>
                <div
                  style={{
                    background: '#e0e7ff',
                    borderRadius: 12,
                    height: 22,
                    overflow: 'hidden',
                    boxShadow: '0 1px 8px #2563eb33',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: progreso + '%',
                      background: 'linear-gradient(90deg, #22c55e 0%, #2563eb 100%)',
                      height: '100%',
                      borderRadius: 12,
                      transition: 'width .5s cubic-bezier(.4,2,.6,1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: progreso > 10 ? 12 : 0,
                    }}
                  >
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, textShadow: '0 1px 3px #2563eb66' }}>{progreso >= 10 ? progreso + '%' : ''}</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: '24px', background: '#fff' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {tareas.length === 0 && (
                  <li style={{ color: '#64748b', textAlign: 'center', padding: '32px 0', fontSize: 18 }}>
                    No hay tareas registradas aún.
                  </li>
                )}
                {tareas.map((tarea) => (
                  <li
                    key={tarea.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 14,
                      padding: '14px 18px',
                      border: '1.5px solid #e0e7ff',
                      borderRadius: 12,
                      background: '#f8fafc',
                      boxShadow: '0 1px 8px #2563eb11',
                      transition: 'box-shadow .2s',
                    }}
                  >
                    <span style={{ flex: 1, fontWeight: 700, fontSize: 18, color: '#2563eb' }}>
                      {tarea.nombre}
                    </span>
                    <span
                      style={{
                        marginRight: 18,
                        color: '#fff',
                        background: estadosColor[tarea.estado],
                        borderRadius: 8,
                        padding: '4px 14px',
                        fontWeight: 'bold',
                        fontSize: 15,
                        boxShadow: '0 1px 4px #0001',
                      }}
                    >
                      {tarea.estado}
                    </span>
                    <span
                      title={
                        tarea.puntos === 1
                          ? 'Un día completo'
                          : tarea.puntos === 0.5
                          ? 'Medio día'
                          : `${tarea.puntos} días`
                      }
                      style={{
                        background: '#fff',
                        border: '1.5px solid #22c55e',
                        color: '#22c55e',
                        borderRadius: 8,
                        padding: '4px 14px',
                        fontSize: 16,
                        fontWeight: 700,
                        marginLeft: 12,
                        boxShadow: '0 1px 4px #22c55e22',
                      }}
                    >
                      {tarea.puntos.toLocaleString('es-ES', {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 2,
                      })} pts
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
      {vista === 'operativo' && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 16 }}>
            Tablero Kanban
          </h2>
          <KanbanControlled tareas={tareas} setTareas={setTareas} />
        </div>
      )}
    </div>
  )
}

export default Dashboard
