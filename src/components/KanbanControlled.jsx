import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const estadosKanban = {
  "por-hacer": "pendiente",
  "en-ejecucion": "en ejecución",
  terminado: "completada",
};
const columnasNombres = {
  "por-hacer": "Por hacer",
  "en-ejecucion": "En ejecución",
  terminado: "Terminado",
};

function tareasToColumnas(tareas) {
  const cols = {
    "por-hacer": [],
    "en-ejecucion": [],
    terminado: [],
  };
  tareas.forEach(t => {
    if (t.estado === "pendiente") cols["por-hacer"].push(t);
    else if (t.estado === "en ejecución") cols["en-ejecucion"].push(t);
    else cols["terminado"].push(t);
  });
  return {
    "por-hacer": { nombre: columnasNombres["por-hacer"], items: cols["por-hacer"] },
    "en-ejecucion": { nombre: columnasNombres["en-ejecucion"], items: cols["en-ejecucion"] },
    terminado: { nombre: columnasNombres["terminado"], items: cols["terminado"] },
  };
}

export default function KanbanControlled({ tareas, setTareas }) {
  const columnas = React.useMemo(() => tareasToColumnas(tareas), [tareas]);

  const onDragEnd = result => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const sourceCol = columnas[source.droppableId].items;

    const moved = sourceCol[source.index];
    // Cambia el estado según la columna destino
    const newEstado = estadosKanban[destination.droppableId];
    const nuevasTareas = tareas.map(t =>
      t.id === moved.id ? { ...t, estado: newEstado } : t
    );
    // Reordenar en la columna destino
    let nuevasTareasCopy = [...nuevasTareas];
    // Encontrar el índice actual y remover la tarea movida
    const fromIndex = nuevasTareasCopy.findIndex(t => t.id === moved.id);
    if (fromIndex !== -1) {
      nuevasTareasCopy.splice(fromIndex, 1);
      // Insertar en la nueva posición visual
      // Calcular el índice de inserción en la lista plana
      let toIndex = 0;
      let count = 0;
      for (const colId of ["por-hacer", "en-ejecucion", "terminado"]) {
        if (colId === destination.droppableId) {
          toIndex = count + destination.index;
          break;
        }
        count += columnas[colId].items.length;
      }
      nuevasTareasCopy.splice(toIndex, 0, { ...moved, estado: newEstado });
    }
    setTareas(nuevasTareasCopy);
  };

  return (
    <div style={{maxWidth: 1200, margin: '0 auto'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 36, marginBottom: 8}}>
        <span style={{fontSize: 36, color: '#2563eb'}}>🗂️</span>
        <h2 style={{fontWeight: 900, fontSize: 32, color: '#2563eb', margin: 0, letterSpacing: 1, fontFamily: 'Poppins, Inter, Arial, sans-serif'}}>Tablero Kanban</h2>
        <span style={{marginLeft: 18, color: '#64748b', fontWeight: 600, fontSize: 18}}>
          {tareas.length} tareas
        </span>
      </div>
      <div style={{marginBottom: 18, color: '#64748b', fontSize: 16, fontFamily: 'Poppins, Inter, Arial, sans-serif'}}>Arrastra y suelta tareas entre columnas para actualizar su estado.</div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 36,
          marginTop: 12,
          background: 'linear-gradient(90deg, #f0f9ff 0%, #f0fdf4 100%)',
          padding: 28,
          borderRadius: 22,
          boxShadow: '0 6px 32px #2563eb22',
          minHeight: 440,
          fontFamily: 'Poppins, Inter, Arial, sans-serif',
        }}>
          {Object.entries(columnas).map(([colId, col]) => (
            <Droppable droppableId={colId} key={colId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: snapshot.isDraggingOver ? "#e0e7ff" : "#f1f5f9",
                    padding: 18,
                    minWidth: 290,
                    minHeight: 370,
                    borderRadius: 18,
                    boxShadow: snapshot.isDraggingOver ? '0 4px 24px #2563eb44' : '0 2px 12px #0001',
                    border: '2px solid #e0e7ff',
                    transition: 'background .2s, box-shadow .2s',
                    display: 'flex', flexDirection: 'column',
                  }}
                >
                  <h3 style={{
                    textAlign: 'center',
                    fontWeight: 900,
                    fontSize: 24,
                    color: '#2563eb',
                    marginBottom: 18,
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    textShadow: '0 2px 8px #2563eb22',
                    fontFamily: 'Poppins, Inter, Arial, sans-serif'
                  }}>
                    {colId === 'por-hacer' && <span style={{marginRight: 8}}>📝</span>}
                    {colId === 'en-ejecucion' && <span style={{marginRight: 8}}>⚙️</span>}
                    {colId === 'terminado' && <span style={{marginRight: 8}}>✅</span>}
                    {col.nombre}
                  </h3>
                  {col.items.map((item, idx) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => {
                            if (item.estado === 'pendiente') {
                              setTareas(prev => prev.map(t => t.id === item.id ? { ...t, estado: 'en ejecución' } : t));
                            } else if (item.estado === 'en ejecución') {
                              setTareas(prev => prev.map(t => t.id === item.id ? { ...t, estado: 'completada' } : t));
                            }
                          }}
                          style={{
                            userSelect: "none",
                            margin: "0 0 12px 0",
                            padding: '14px 16px',
                            background: snapshot.isDragging ? "linear-gradient(90deg, #93c5fd 0%, #a7f3d0 100%)" : "#fff",
                            color: "#222",
                            borderRadius: 10,
                            boxShadow: snapshot.isDragging ? "0 4px 18px #2563eb44" : "0 2px 8px #0001",
                            border: '1.5px solid #e0e7ff',
                            fontSize: 17,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'background .2s, box-shadow .2s',
                            fontFamily: 'Poppins, Inter, Arial, sans-serif',
                            maxWidth: '100%',
                            minWidth: 0,
                            overflow: 'hidden',
                            cursor: (item.estado === 'pendiente' || item.estado === 'en ejecución') ? 'pointer' : 'default',
                            ...provided.draggableProps.style,
                          }}
                          title={
                            item.estado === 'pendiente'
                              ? 'Haz click para pasar a "En ejecución"'
                              : item.estado === 'en ejecución'
                              ? 'Haz click para pasar a "Completada"'
                              : ''
                          }
                        >
                          <span style={{
                            flex: 1,
                            fontWeight: 700,
                            fontSize: 17,
                            color: '#2563eb',
                            fontFamily: 'Poppins, Inter, Arial, sans-serif',
                            minWidth: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>{item.nombre}</span>
                          <span
                            title={item.estado === 'pendiente' ? 'Pendiente' : item.estado === 'en ejecución' ? 'En ejecución' : 'Completada'}
                            style={{
                              marginLeft: 2,
                              background: item.estado === 'pendiente' ? '#fde68a' : item.estado === 'en ejecución' ? '#bae6fd' : '#bbf7d0',
                              color: item.estado === 'pendiente' ? '#b45309' : item.estado === 'en ejecución' ? '#0369a1' : '#15803d',
                              borderRadius: 6,
                              padding: '2px 7px',
                              fontSize: 13,
                              fontWeight: 800,
                              fontFamily: 'Poppins, Inter, Arial, sans-serif',
                              minWidth: 18,
                              textAlign: 'center',
                              display: 'inline-block',
                            }}>
                            {item.estado === 'pendiente' ? 'P' : item.estado === 'en ejecución' ? 'E' : 'C'}
                          </span>
                          <span
                            title={
                              item.puntos === 1
                                ? 'Un día completo'
                                : item.puntos === 0.5
                                ? 'Medio día'
                                : `${item.puntos} días`
                            }
                            style={{
                              marginLeft: 2,
                              background: '#fff',
                              border: '1px solid #22c55e',
                              color: '#22c55e',
                              borderRadius: 6,
                              padding: '2px 7px',
                              fontSize: 13,
                              fontWeight: 700,
                              fontFamily: 'Poppins, Inter, Arial, sans-serif',
                              minWidth: 18,
                              textAlign: 'center',
                              display: 'inline-block',
                            }}
                          >
                            {item.puntos.toLocaleString('es-ES', {
                              minimumFractionDigits: 1,
                              maximumFractionDigits: 2,
                            })} pts
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
