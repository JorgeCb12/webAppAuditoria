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
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 32,
        marginTop: 32,
        background: '#f8fafc',
        padding: 24,
        borderRadius: 16,
        boxShadow: '0 2px 16px #0001',
        minHeight: 400
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
                  fontWeight: 800,
                  fontSize: 26,
                  color: '#2563eb',
                  marginBottom: 18,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  textShadow: '0 2px 8px #2563eb22'
                }}>{col.nombre}</h3>
                {col.items.map((item, idx) => (
                  <Draggable draggableId={item.id.toString()} index={idx} key={item.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          margin: "0 0 16px 0",
                          padding: 20,
                          background: snapshot.isDragging ? "linear-gradient(90deg, #93c5fd 0%, #a7f3d0 100%)" : "#fff",
                          color: "#222",
                          borderRadius: 14,
                          boxShadow: snapshot.isDragging ? "0 4px 18px #2563eb44" : "0 2px 8px #0001",
                          border: '1.5px solid #e0e7ff',
                          fontSize: 18,
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          transition: 'background .2s, box-shadow .2s',
                          ...provided.draggableProps.style,
                        }}
                      >
                        <span style={{flex: 1}}>{item.nombre}</span>
                        <span style={{
                          background: item.estado === 'pendiente' ? '#fde68a' : item.estado === 'en ejecución' ? '#bae6fd' : '#bbf7d0',
                          color: item.estado === 'pendiente' ? '#b45309' : item.estado === 'en ejecución' ? '#0369a1' : '#15803d',
                          padding: '4px 12px',
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 700,
                          marginRight: 8
                        }}>{item.estado}</span>
                        <span style={{
                          background: '#f3f4f6',
                          borderRadius: 6,
                          padding: '4px 10px',
                          fontSize: 15,
                          color: '#64748b',
                          fontWeight: 600
                        }}>{item.puntos} pts</span>
                        {item.nombre}
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
  );
}
